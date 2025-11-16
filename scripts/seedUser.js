const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

(async () => {
  const DATA_DIR = path.join(process.cwd(), 'data');
  const USERS_FILE = path.join(DATA_DIR, 'users.json');
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  const email = process.env.SEED_EMAIL || 'test@example.com';
  const password = process.env.SEED_PASSWORD || 'secret123';
  const name = process.env.SEED_NAME || 'Test User';

  const users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')) : [];
  if (users.find(u => u.email === email.toLowerCase())) {
    console.log('User already exists:', email);
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = {
    id: String(Date.now()),
    name,
    email: email.toLowerCase(),
    passwordHash: hash,
    failedAttempts: 0,
    lockUntil: null
  };
  users.push(user);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log('Seed user created:');
  console.log('  email:', email);
  console.log('  password:', password);
})();
