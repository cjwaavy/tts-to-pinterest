import { NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any)?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session as any)?.user?.id;

  try {
    // (Optionally, you can also delete any other Pinterest details (e.g. board info) if needed.)
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { pinterestUsername: null, postedVideos: {} }
    });
    console.log("Pinterest token (and details) deleted for user (id:", userId, "). (Updated user:", updateUser, ")");
    return NextResponse.json({ success: true, message: "Pinterest unlinked (token deleted)." }, { status: 200 });
  } catch (error) {
    console.error("Error unlinking Pinterest (deleting token) in /api/pinterest/unlink:", error);
    return NextResponse.json({ error: "Internal Server Error (unlink Pinterest)" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 