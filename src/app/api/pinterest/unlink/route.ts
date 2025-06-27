import { NextResponse } from 'next/server';
import { auth, authOptions } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

export async function POST(request: Request) {
  const session = await auth()
  // console.log(session)
  if (!session || !(session as any)?.pinterestAccessToken) {
    // console.log("Denied")
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session as any)?.user?.id;

  try {
    // (Optionally, you can also delete any other Pinterest details (e.g. board info) if needed.)
    const pinterestAccount = await prisma.account.findFirst({where: {userId: userId, provider: 'pinterest'}})
    // console.log("pinterestAccount:", pinterestAccount)
    const deletePinterestAccount = await prisma.account.delete({where: {id: pinterestAccount?.id}})
    // console.log('object deleted:', deletePinterestAccount)
    // const updateUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: { pinterestUsername: null, postedVideos: {} }
    // });
    // console.log('user updated:', updateUser)
    // console.log("Pinterest token (and details) deleted for user (id:", userId, "). (Updated user:", updateUser, ")");
    return NextResponse.json({ success: true, message: "Pinterest unlinked (token deleted)." }, { status: 200 });
  } catch (error) {
    console.error("Error unlinking Pinterest (deleting token) in /api/pinterest/unlink:", error);
    return NextResponse.json({ error: "Internal Server Error (unlink Pinterest)" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
