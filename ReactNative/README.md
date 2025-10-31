# EchoinWhspr React Native App

A React Native application built with Expo for the EchoinWhspr platform.

## Features

- Built with Expo SDK 49
- TypeScript support
- Hedera SDK integration
- Design system integration (shared with web app)

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platform:
   ```bash
   npm run android  # for Android
   npm run ios      # for iOS
   npm run web      # for web
   ```

## Project Structure

- `App.tsx` - Main application entry point
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript configuration

## Dependencies

- `@hashgraph/sdk` - Hedera SDK for blockchain integration
- `expo` - Expo framework
- `react-native` - React Native framework
- `react` - React library

## Development

This app is part of a monorepo and shares the design system with the web application.