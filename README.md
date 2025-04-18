# Dornhub - Pornhub Model Analytics & Viewer (React Native + Apify Example)

This is an [Expo](https://expo.dev) project demonstrating how to use Apify scrapers and Gemini AI within a React Native application. It fetches data from a Pornhub model page, analyzes the content using Gemini AI, and provides comprehensive analytics about model performance and content strategy.

![App Preview](assets/images/preview-app.png)

This app relies on the following technologies:

- [Pornhub Model Data Extractor](https://apify.com/pintxuki/pornhub-channel-extractor): Fetches general model information and video list.
- [Pornhub Video (Downloader)](https://apify.com/pintxuki/pornhub-video-extractor): Fetches detailed video information, including metadata and download links.
- [Gemini AI](https://ai.google.dev/): Analyzes model content and provides performance insights.

_Note: Ensure your use of scraped data complies with Apify's and Pornhub's terms of service._

## Features

- Fetches and displays model information (name, description, stats, etc.)
- Fetches and displays a list of videos from the model page
- Advanced analytics powered by Gemini AI:
  - Performance metrics (views, likes, engagement rates)
  - Category and tag performance analysis
  - Model attributes impact analysis
  - Optimal posting times recommendations
  - AI-powered content strategy suggestions
  - Video performance ranking
- Uses TanStack Query for data fetching and caching
- Includes pull-to-refresh functionality
- Uses SQLite for offline data caching

## Technology Stack

- React Native / Expo
- TypeScript
- Apify (for Pornhub data scraping)
- Gemini AI (for content analysis)
- TanStack Query (React Query)
- SQLite (via expo-sqlite)

## Get started

1. **Set up Environment Variables**

   Create a `.env` file in the root of the project by copying the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and add your:

   - `EXPO_PUBLIC_APIFY_TOKEN`
   - `EXPO_PUBLIC_GEMINI_API_KEY`

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Analytics Features

The app provides comprehensive analytics for the last 5, 10, or 15 videos of a model channel, including:

- **Performance Metrics**

  - Average views, likes, dislikes, and favorites
  - Engagement and favorite rates
  - View-to-engagement ratio
  - Peak performance time
  - Best performing video analysis

- **Content Analysis**

  - Category performance and distribution
  - Tag performance and optimization
  - Model attributes impact
  - Optimal posting times

- **AI Recommendations**
  - Content strategy suggestions
  - Model attributes optimization
  - Posting schedule recommendations
  - Tag optimization tips

## Video Playback and Conversion

Some external video players may not support the HLS (HTTP Live Streaming) format provided by the source URLs. If you encounter playback issues, you might need to convert the video to a more widely supported format like MP4.

You can use the `ffmpeg` command-line tool for this conversion:

```bash
ffmpeg -i 'YOUR_VIDEO_DOWNLOAD_URL' -c copy output.mp4
```

Replace `'YOUR_VIDEO_DOWNLOAD_URL'` with the actual download URL obtained from the Apify actor.

**Important Note:** Integrating this conversion directly into the React Native app is currently not feasible, as the `react-native-ffmpeg-kit` library has been discontinued.

**Disclaimer:** This project is intended for educational purposes only, demonstrating the integration of React Native with Apify and Gemini AI. Downloading copyrighted material may violate terms of service or copyright laws. Proceed responsibly.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
