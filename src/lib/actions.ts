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

export async function getJobById(id: number) {
  const stmt = db.prepare('SELECT * FROM jobs WHERE id = ?');
  return stmt.get(id);
}

export async function updateJob(id: number, data: any) {
  const stmt = db.prepare(`
    UPDATE jobs 
    SET name = ?, phone = ?, email = ?, address = ?, map_link = ?, total = ?, notes = ?, data_json = ?
    WHERE id = ?
  `);
  
  stmt.run(
    data.name,
    data.phone,
    data.email,
    data.address,
    `https://maps.google.com/?q=${encodeURIComponent(data.address)}`,
    data.total,
    data.notes,
    JSON.stringify(data.items),
    id
  );
  
  revalidatePath('/portal');
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
    revalidatePath('/portal');
  }
}

export async function updateJobStatus(id: number, newStatus: string) {
  if (statusOrder.includes(newStatus)) {
    db.prepare('UPDATE jobs SET status = ? WHERE id = ?').run(newStatus, id);
    revalidatePath('/portal');
  }
}

import nodemailer from 'nodemailer';

export async function createJob(data: any) {
  const status = data.status || 'Felvételre vár';
  const stmt = db.prepare(`
    INSERT INTO jobs (name, phone, email, address, map_link, status, total, notes, data_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    data.name,
    data.phone,
    data.email,
    data.address,
    `https://maps.google.com/?q=${encodeURIComponent(data.address)}`,
    status,
    data.total,
    data.notes,
    JSON.stringify(data.items)
  );

  revalidatePath('/portal');

  // Send Email Notification
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'info@rubiconszonyeg.hu',
        pass: process.env.SMTP_PASS || '', 
      },
    });

    let itemsHtml = '';
    if (data.items && data.items.length > 0) {
      itemsHtml = '<h3>Rendelt Tételek (Haladó Kalkulátor alapján)</h3><ul>';
      data.items.forEach((it: any) => {
        itemsHtml += `<li><b>${it.service}</b>: ${it.type || it.package || ''} - ~${it.price.toLocaleString('hu-HU')} Ft</li>`;
      });
      itemsHtml += '</ul>';
    }

    const mailOptions: any = {
      from: '"Rubicon Rendszer" <info@rubiconszonyeg.hu>',
      to: 'info@rubiconszonyeg.hu',
      subject: `Új Ajánlatkérés érkezett: ${data.name}`,
      html: `
        <h2>Új Ajánlatkérés a Weboldalról</h2>
        <p><b>Név:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email || 'Nincs megadva'}</p>
        <p><b>Telefon:</b> ${data.phone || 'Nincs megadva'}</p>
        <p><b>Cím:</b> ${data.address}</p>
        <p><b>Végösszeg (Becsült):</b> ${data.total.toLocaleString('hu-HU')} Ft</p>
        <hr />
        <h3>Megjegyzés / Üzenet:</h3>
        <pre style="font-family: inherit; white-space: pre-wrap;">${data.notes}</pre>
        ${itemsHtml}
        <br />
        <p><a href="https://rubiconszonyeg.hu/portal">Megtekintés az Admin Portálon</a></p>
      `,
    };

    if (data.email) {
      mailOptions.replyTo = data.email;
    }

    await transporter.sendMail(mailOptions);
    console.log("Értesítő email sikeresen elküldve.");
  } catch (error) {
    console.error("Hiba az email küldésekor:", error);
  }
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
  db.prepare(`
    INSERT INTO settings (key, value) 
    VALUES (?, ?) 
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, strValue);
  revalidatePath('/portal/settings');
  revalidatePath('/'); // assuming settings affect website
}
