import { NextResponse } from 'next/server';
import { getLockInfo } from '@/lib/userStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email;
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    const info = getLockInfo(email);
    const locked = !!(info.lockUntil && Date.now() < info.lockUntil);
    const remainingMs = locked ? Math.max(0, (info.lockUntil as number) - Date.now()) : 0;
    return NextResponse.json({ locked, remainingMs, failedAttempts: info.failedAttempts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
