export interface IChannelInfo {
  model_name: string;
  model_rank: number;
  bio: string;
  about: string;
  subscribers: number;
  video_views: number;
  profile_views: string;
  videos_watched: string;
  relationship_status: string;
  interested_in: string;
  gender: string;
  birth_place: string;
  height: string;
  weight: string;
  ethnicity: string;
  hair_color: string;
  fake_boobs: string;
  tattoos: string;
  piercings: string;
  interests_and_hobbie: string;
  turn_ons: string;
  is_verified: boolean;
  is_award_winner: boolean;
  social_links: string[];
  url: string;
}

export interface IVideo {
  video_id: string;
  video_vkey: string;
  title: string;
  duration: number;
  views: number;
  rating: string;
  thumbnail_url: string;
  video_url: string;
  preview_url: string;
}

export interface IChannelVideos {
  items: IVideo[];
}

export interface GenericApifyResponse<T> {
  count: number;
  desc: boolean;
  items: T[];
  limit: number;
  offset: number;
  total: number;
}

export type GenericApifyResponseTwo<T> = [T, GenericApifyResponse<T>];

export interface IVideoPreview {
  id: string;
  thumbnail_url: string;
  title: string;
  views: number;
  likes_percentage: string;
  upload_date: string;
  channel_name: string;
  page_title: string;
  page_description: string;
  likes_up: number;
  likes_down: number;
  favorites: number;
  added_date: string;
  categories: string[];
  tags: string[];
  production: string[];
  model_attributes: string[];
  pornstars: string[];
  channel_verified: boolean;
  channel_award_winner: boolean;
  channel_content_partner: boolean;
  channel_videos_count: number;
  channel_subscriber_count: number;
  video_download: string;
  url: string;
}
