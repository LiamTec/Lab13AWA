'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

export default function NavAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      {session?.user ? (
        <>
          <li>
            <Link href="/dashboard" className="hover:text-gray-600">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-gray-600">
              Profile
            </Link>
          </li>
          <li>
            <LogoutButton />
          </li>
          {session.user.image && (
            <li>
              <Image
                height={100}
                width={100}
                src={session.user.image}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </li>
          )}
        </>
      ) : (
        <>
          <li>
            <Link href="/signIn" className="hover:text-gray-600">
              Sign In
            </Link>
          </li>
        </>
      )}
    </>
  );
}
