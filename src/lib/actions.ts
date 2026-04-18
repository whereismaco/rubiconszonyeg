'use server';

import db from './db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function login(email: string) {
  const settings = db.prepare('SELECT value FROM settings WHERE key = ?').get('whitelisted_emails') as any;
  const emails = settings ? JSON.parse(settings.value) : [];
  
  if (emails.includes(email)) {
    (await cookies()).set('rubicon_admin_auth', email, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
    return { success: true };
  }
  return { success: false, error: 'Email nem engedélyezett.' };
}

export async function logout() {
  (await cookies()).delete('rubicon_admin_auth');
}

export async function getJobs() {
  const stmt = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC');
  return stmt.all();
}

export async function getJobsByDate(datePrefix: string) {
  const stmt = db.prepare('SELECT * FROM jobs WHERE created_at LIKE ? ORDER BY created_at DESC');
  return stmt.all(`${datePrefix}%`);
}

const statusOrder = [
  'Felvételre vár',
  'Beérkezett',
  'Tisztítás alatt',
  'Elkészült',
  'Kiszállítva'
];

export async function advanceJobStatus(id: number) {
  const job = db.prepare('SELECT status FROM jobs WHERE id = ?').get(id) as any;
  if (!job) return;
  const currentIndex = statusOrder.indexOf(job.status);
  if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
    const nextStatus = statusOrder[currentIndex + 1];
    db.prepare('UPDATE jobs SET status = ? WHERE id = ?').run(nextStatus, id);
    revalidatePath('/rubicon-gate-portal');
  }
}

export async function createJob(data: any) {
  const stmt = db.prepare(`
    INSERT INTO jobs (name, address, map_link, status, total, notes, data_json)
    VALUES (?, ?, ?, 'Felvételre vár', ?, ?, ?)
  `);
  
  stmt.run(
    data.name,
    data.address,
    `https://maps.google.com/?q=${encodeURIComponent(data.address)}`,
    data.total,
    data.notes,
    JSON.stringify(data.items)
  );
  
  revalidatePath('/rubicon-gate-portal');
}

export async function getSettings() {
  const rows = db.prepare('SELECT * FROM settings').all() as {key: string, value: string}[];
  const settings: Record<string, any> = {};
  for (const row of rows) {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch (e) {
      settings[row.key] = row.value;
    }
  }
  return settings;
}

export async function updateSetting(key: string, value: string | any) {
  const strValue = typeof value === 'string' ? value : JSON.stringify(value);
  db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(strValue, key);
  revalidatePath('/rubicon-gate-portal/settings');
  revalidatePath('/'); // assuming settings affect website
}
