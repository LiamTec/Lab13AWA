import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  failedAttempts?: number;
  lockUntil?: number | null;
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

function readUsers(): User[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw) as User[];
  } catch (e) {
    return [];
  }
}

function writeUsers(users: User[]) {
  ensureDataFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  const users = readUsers();
  const exists = users.find((u) => u.email === email.toLowerCase());
  if (exists) throw new Error('User already exists');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user: User = {
    id: String(Date.now()),
    name,
    email: email.toLowerCase(),
    passwordHash: hash,
    failedAttempts: 0,
    lockUntil: null,
  };
  users.push(user);
  writeUsers(users);
  return { id: user.id, name: user.name, email: user.email };
}

export function findUserByEmail(email: string) {
  const users = readUsers();
  return users.find((u) => u.email === email.toLowerCase()) || null;
}

export async function verifyPassword(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) return false;
  // Check lock
  if (user.lockUntil && Date.now() < user.lockUntil) return 'locked';
  const match = await bcrypt.compare(password, user.passwordHash);
  if (match) {
    resetFailedAttempts(email);
    return true;
  }
  incrementFailedAttempt(email);
  return false;
}

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

export function incrementFailedAttempt(email: string) {
  const users = readUsers();
  const u = users.find((x) => x.email === email.toLowerCase());
  if (!u) return;
  u.failedAttempts = (u.failedAttempts || 0) + 1;
  if ((u.failedAttempts || 0) >= MAX_ATTEMPTS) {
    u.lockUntil = Date.now() + LOCK_TIME_MS;
  }
  writeUsers(users);
}

export function resetFailedAttempts(email: string) {
  const users = readUsers();
  const u = users.find((x) => x.email === email.toLowerCase());
  if (!u) return;
  u.failedAttempts = 0;
  u.lockUntil = null;
  writeUsers(users);
}

export function isLocked(email: string) {
  const u = findUserByEmail(email);
  if (!u) return false;
  if (u.lockUntil && Date.now() < u.lockUntil) return true;
  return false;
}

export function getLockInfo(email: string) {
  const u = findUserByEmail(email);
  if (!u) return { failedAttempts: 0, lockUntil: null };
  return { failedAttempts: u.failedAttempts || 0, lockUntil: u.lockUntil || null };
}
