# TikTok to Pinterest Reposter

A Next.js application that allows you to repost your TikTok videos to Pinterest. This application uses the TikTok and Pinterest APIs to fetch your videos and create pins.

## Features

- TikTok authentication
- Pinterest authentication
- Browse your TikTok videos
- Repost videos to Pinterest with a single click
- Modern, responsive UI

## Prerequisites

- Node.js 18+ and npm
- TikTok Developer Account
- Pinterest Developer Account

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tts-to-pinterest.git
cd tts-to-pinterest
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# TikTok API Credentials
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/tiktok

# Pinterest API Credentials
PINTEREST_APP_ID=your_pinterest_app_id
PINTEREST_APP_SECRET=your_pinterest_app_secret
PINTEREST_REDIRECT_URI=http://localhost:3000/api/auth/callback/pinterest

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret # Generate this with: openssl rand -base64 32
```

4. Get your API credentials:
   - TikTok: Create a developer account at https://developers.tiktok.com/
   - Pinterest: Create a developer account at https://developers.pinterest.com/

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Sign in with TikTok" to connect your TikTok account
2. Click "Sign in with Pinterest" to connect your Pinterest account
3. Browse your TikTok videos
4. Click "Repost to Pinterest" on any video to share it to your Pinterest account

## Security Notes

- Never commit your `.env.local` file
- Keep your API credentials secure
- The application uses NextAuth.js for secure authentication
- All API calls are made server-side to protect your credentials

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
