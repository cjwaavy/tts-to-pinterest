import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import { prisma } from '@/lib/prisma';


export async function GET() {
  const DAILY_CAP = 5;
  const session = await auth();

  // Ensure user is authenticated
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the user has reached the daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to beginning of next day

    const pinsCreatedToday: number = await prisma.postedVideo.count({
      where: {
        userId: session.userId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    const remaining = DAILY_CAP - pinsCreatedToday;
    const hasReachedLimit = pinsCreatedToday >= DAILY_CAP;

    // Calculate hours until next day (midnight)
    const now = new Date();
    const hoursUntilNextDay = Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hasReachedLimit) {
      return NextResponse.json({
        success: false,
        error: 'Daily limit reached',
        message: `You can only create ${DAILY_CAP} pins per day. Please try again tomorrow.`,
        pinsCreatedToday,
        remaining: 0,
        hasReachedLimit,
        hoursUntilNextDay
      }, { status: 429 });
    }

    return NextResponse.json({
      success: true,
      pinsCreatedToday,
      remaining,
      hasReachedLimit,
      hoursUntilNextDay
    });
  } catch (error) {
    console.error('Error checking daily cap:', error);
    return NextResponse.json(
      { error: 'Failed to check daily pin limit' },
      { status: 500 }
    );
  }
}
