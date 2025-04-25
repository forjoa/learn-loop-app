# Learn Loop App

Learn Loop App is the mobile version of the Learn Loop platform, providing a seamless learning experience on mobile devices. The application is built using React Native and Expo, making it available for both iOS and Android platforms.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
  ```bash
  npm install -g expo-cli
  ```
- For iOS development: macOS with Xcode installed
- For Android development: Android Studio with Android SDK

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/learn-loop-app.git
   cd learn-loop-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if you use yarn
   yarn install
   ```

## Running the App

### Start the development server:

```bash
npm start
# or
yarn start
# or
expo start
```

This will open the Expo Developer Tools in your browser.

### Run on specific platforms:

- For iOS:
  ```bash
  npm run ios
  # or
  yarn ios
  ```

- For Android:
  ```bash
  npm run android
  # or
  yarn android
  ```

- For Web:
  ```bash
  npm run web
  # or
  yarn web
  ```

## Project Structure

- `/app`: Contains the main application code using Expo Router
- `/components`: Reusable UI components
- `/assets`: Static assets like images and fonts
- `/constants`: Application constants and theme configuration
- `/hooks`: Custom React hooks

## Features

- Cross-platform support (iOS, Android, Web)
- Expo Router for navigation
- TypeScript support
- Secure storage for sensitive data
- Responsive UI design

## Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## License

[Include license information here]

## Contact

[Include contact information here]
