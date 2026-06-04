import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Helper to check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  
  // In a real app, you'd check a role or a specific email
  // e.g., if (session.user.email !== process.env.ADMIN_EMAIL) return false;
  // For this MVP, we just require any authenticated user.
  return true;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unverified = await prisma.salaryEntry.findMany({
      where: { verified: false },
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: unverified });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    if (action === 'approve') {
      const entry = await prisma.salaryEntry.update({
        where: { id },
        data: { verified: true }
      });
      return NextResponse.json({ data: entry, message: 'Approved' });
    } else if (action === 'reject') {
      await prisma.salaryEntry.delete({
        where: { id }
      });
      return NextResponse.json({ message: 'Rejected and deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
