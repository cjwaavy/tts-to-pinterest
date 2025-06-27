import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await auth()

  if (!session || !(session as any)?.discordAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session as any)?.user?.id;

  try {
    // Find and delete the Discord account for this user
    const discordAccount = await prisma.account.findFirst({
      where: {
        userId: userId,
        provider: 'discord'
      }
    });

    if (!discordAccount) {
      return NextResponse.json({ error: 'Discord account not found' }, { status: 404 });
    }

    await prisma.account.delete({
      where: { id: discordAccount.id }
    });

    return NextResponse.json({
      success: true,
      message: "Discord account unlinked successfully."
    }, { status: 200 });
  } catch (error) {
    console.error("Error unlinking Discord account:", error);
    return NextResponse.json({
      error: "Internal Server Error (unlink Discord)"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
