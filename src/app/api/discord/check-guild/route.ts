import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios from 'axios';
import { APIGuild } from 'discord-api-types/v10';

// The guild ID to check
const TARGET_GUILD_ID = '1342300566134587463';

export async function GET() {
  const session = await auth();

  // Ensure user is authenticated and has a Discord token
  if (!session?.userId || !session?.discordAccessToken) {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized or Discord not connected',
      isInGuild: false
    }, { status: 401 });
  }
  try {
    // Get the user's guilds from Discord API
    const response = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.discordAccessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Check if the user is in the target guild
    const guilds = response.data;
    const isInGuild = guilds.some((guild: APIGuild) => guild.id === TARGET_GUILD_ID);

    return NextResponse.json({
      success: true,
      isInGuild,
      guildId: TARGET_GUILD_ID
    });
  } catch (error: any) {
    console.error('Error checking Discord guild membership:', error);

    // Handle token expiration or other API errors
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to check guild membership';

    return NextResponse.json({
      success: false,
      error: message,
      isInGuild: false
    }, { status });
  }
}
