import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/userStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = findUserByEmail(email);
    if (exists) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 });
    }

    const user = await createUser({ name, email, password });
    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
