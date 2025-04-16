import * as SQLite from "expo-sqlite";
import { IChannelInfo, IVideo, IVideoPreview } from "../types/channel";

export class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync("dornhub.db");
      await this.createTables();
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS channel_info (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        last_updated INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS channel_videos (
        video_id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        last_updated INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS video_previews (
        video_id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        last_updated INTEGER NOT NULL
      );
    `);
  }

  public async saveChannelInfo(info: IChannelInfo): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      "INSERT OR REPLACE INTO channel_info (id, data, last_updated) VALUES (?, ?, ?)",
      "main",
      JSON.stringify(info),
      Date.now()
    );
  }

  public async getChannelInfo(): Promise<IChannelInfo | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync<{ data: string }>(
      "SELECT data FROM channel_info WHERE id = ? AND last_updated > ?",
      "main",
      Date.now() - 24 * 60 * 60 * 1000 // 24 hours cache
    );

    return result ? JSON.parse(result.data) : null;
  }

  public async saveChannelVideos(videos: IVideo[]): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync("BEGIN TRANSACTION");
    try {
      for (const video of videos) {
        await this.db.runAsync(
          "INSERT OR REPLACE INTO channel_videos (video_id, data, last_updated) VALUES (?, ?, ?)",
          video.video_id,
          JSON.stringify(video),
          Date.now()
        );
      }
      await this.db.execAsync("COMMIT");
    } catch (error) {
      await this.db.execAsync("ROLLBACK");
      throw error;
    }
  }

  public async getChannelVideos(): Promise<IVideo[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync<{ data: string }>(
      "SELECT data FROM channel_videos WHERE last_updated > ? ORDER BY last_updated DESC",
      Date.now() - 24 * 60 * 60 * 1000 // 24 hours cache
    );

    return result.map((row) => JSON.parse(row.data));
  }

  public async saveVideoPreview(
    videoId: string,
    preview: IVideoPreview
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      "INSERT OR REPLACE INTO video_previews (video_id, data, last_updated) VALUES (?, ?, ?)",
      videoId,
      JSON.stringify(preview),
      Date.now()
    );
  }

  public async getVideoPreview(
    videoId: string
  ): Promise<{ preview: IVideoPreview } | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync<{ data: string }>(
      "SELECT data FROM video_previews WHERE video_id = ? AND last_updated > ?",
      videoId,
      Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days cache for videos
    );

    if (!result) return null;

    return {
      preview: JSON.parse(result.data),
    };
  }

  /**
   * Clears all data from the database tables.
   */
  public async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync("BEGIN TRANSACTION");
    try {
      await this.db.execAsync("DELETE FROM channel_info");
      await this.db.execAsync("DELETE FROM channel_videos");
      await this.db.execAsync("DELETE FROM video_previews");
      await this.db.execAsync("COMMIT");
    } catch (error) {
      await this.db.execAsync("ROLLBACK");
      throw error; // Re-throw the error after logging
    }
  }
}
