# Dornhub - Ph Channel Viewer (React Native + Apify Example)

This is an [Expo](https://expo.dev) project demonstrating how to use Apify scrapers within a React Native application. It fetches data from a Ph channel scraper and displays the channel information and video list.

This app relies on the following Apify actors to scrape Pornhub data:

- [Pornhub Channel Data Extractor](https://apify.com/pintxuki/pornhub-channel-extractor)
- [Pornhub Video (Downloader)](https://apify.com/pintxuki/pornhub-video-extractor)

_Note: Ensure your use of scraped data complies with Apify's and Pornhub's terms of service._

## Features

- Fetches and displays channel information (name, description, stats, etc.).
- Fetches and displays a list of videos from the channel.
- Allows navigation to a video detail screen (placeholder).
- Uses TanStack Query for data fetching and caching.
- Includes pull-to-refresh functionality.

## Technology Stack

- React Native / Expo
- TypeScript
- Apify (for Pornhub data scraping)
- TanStack Query (React Query)

## Get started

1. **Set up Environment Variables**

   Create a `.env` file in the root of the project by copying the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and replace the placeholder values for `EXPO_PUBLIC_APIFY_TOKEN` and `EXPO_PUBLIC_CHANNEL_URL` with your actual Apify token and the target channel URL. The Actor IDs are pre-configured for this example.

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Apify Integration

This app relies on Apify actors to scrape Pornhub data. You will need to configure the Apify client or the specific hooks (`hooks/onGetChannelInfo.ts`, `hooks/onGetChannelVideos.ts`) with your Apify token. The actor IDs for the Apify actors listed above are pre-configured in the `.env.example` and used by the hooks.

_Note: Ensure your use of scraped data complies with Apify's and Pornhub's terms of service._

## Video Playback and Conversion

Some external video players may not support the HLS (HTTP Live Streaming) format provided by the source URLs. If you encounter playback issues, you might need to convert the video to a more widely supported format like MP4.

You can use the `ffmpeg` command-line tool for this conversion:

```bash
ffmpeg -i 'YOUR_VIDEO_DOWNLOAD_URL' -c copy output.mp4
```

Replace `'YOUR_VIDEO_DOWNLOAD_URL'` with the actual download URL obtained from the Apify actor.

**Important Note:** Integrating this conversion directly into the React Native app is currently not feasible, as the `react-native-ffmpeg-kit` library has been discontinued.

**Disclaimer:** This project is intended for educational purposes only, demonstrating the integration of React Native with Apify. Downloading copyrighted material may violate terms of service or copyright laws. Proceed responsibly.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
