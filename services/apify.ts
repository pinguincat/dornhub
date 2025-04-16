import { ActorRun } from "apify-client";

// TODO: Store your Apify token securely, e.g., in environment variables
const APIFY_TOKEN =
  process.env.EXPO_PUBLIC_APIFY_TOKEN || "YOUR_APIFY_TOKEN_HERE";

const APIFY_BASE_URL = "https://api.apify.com/v2";

interface RunApifyActorArgs {
  actorId: string;
  input: Record<string, any>;
  options?: {
    pollIntervalMs?: number;
    pollTimeoutMs?: number;
  };
}

/**
 * Runs an Apify actor, waits for it to finish, and fetches its dataset items.
 */
export async function runApifyActor<T>({
  actorId,
  input,
  options = {},
}: RunApifyActorArgs): Promise<T[]> {
  const { pollIntervalMs = 5000, pollTimeoutMs = 300000 } = options; // Default 5s interval, 5min timeout

  if (!APIFY_TOKEN || APIFY_TOKEN === "YOUR_API_TOKEN") {
    console.error(
      "Apify API token is not configured. Please set EXPO_PUBLICAPIFY_TOKEN environment variable."
    );
    throw new Error("Apify API token is missing.");
  }

  // 1. Start the actor run
  const runResponse = await fetch(
    `${APIFY_BASE_URL}/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    console.error("Failed to start Apify actor run:", errorText);
    throw new Error(
      `Failed to start Apify actor run: ${runResponse.statusText}`
    );
  }

  const runResult: { data: ActorRun } = await runResponse.json();
  const runId = runResult.data.id;
  const defaultDatasetId = runResult.data.defaultDatasetId;

  // 2. Poll for run status
  const startTime = Date.now();
  let runStatus: ActorRun | null = null;

  do {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    const statusResponse = await fetch(
      `${APIFY_BASE_URL}/acts/${actorId}/runs/${runId}?token=${APIFY_TOKEN}`
    );

    if (!statusResponse.ok) {
      console.warn(
        `Failed to get run status (${statusResponse.statusText}), retrying...`
      );
      continue; // Or throw an error after several retries
    }

    const statusResult: { data: ActorRun } = await statusResponse.json();
    runStatus = statusResult.data;

    if (Date.now() - startTime > pollTimeoutMs) {
      throw new Error(
        `Apify actor run timed out after ${pollTimeoutMs / 1000} seconds.`
      );
    }
  } while (
    runStatus?.status !== "SUCCEEDED" &&
    runStatus?.status !== "FAILED" &&
    runStatus?.status !== "ABORTED" &&
    runStatus?.status !== "TIMED-OUT"
  );

  if (runStatus?.status !== "SUCCEEDED") {
    throw new Error(
      `Apify actor run failed with status: ${runStatus?.status ?? "UNKNOWN"}`
    );
  }

  // 3. Fetch dataset items
  const datasetResponse = await fetch(
    `${APIFY_BASE_URL}/datasets/${defaultDatasetId}/items?token=${APIFY_TOKEN}`
  );

  if (!datasetResponse.ok) {
    throw new Error("Failed to fetch dataset items");
  }

  const items: T[] = await datasetResponse.json();
  return items;
}
