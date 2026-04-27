'use server';

import pool from './db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

export async function login(email: string) {
  const [rows]: any = await pool.execute('SELECT value FROM settings WHERE \`key\` = ?', ['whitelisted_emails']);
  const settings = rows[0];
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
  const [rows]: any = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
  return rows;
}

export async function getJobsByDate(datePrefix: string) {
  const [rows]: any = await pool.execute('SELECT * FROM jobs WHERE created_at LIKE ? ORDER BY created_at DESC', [`${datePrefix}%`]);
  return rows;
}

export async function getJobById(id: number) {
  const [rows]: any = await pool.execute('SELECT * FROM jobs WHERE id = ?', [id]);
  return rows[0];
}

export async function updateJob(id: number, data: any) {
  await pool.execute(`
    UPDATE jobs 
    SET name = ?, phone = ?, email = ?, address = ?, map_link = ?, total = ?, notes = ?, data_json = ?
    WHERE id = ?
  `, [
    data.name,
    data.phone,
    data.email,
    data.address,
    `https://maps.google.com/?q=${encodeURIComponent(data.address || '')}`,
    data.total,
    data.notes,
    JSON.stringify(data.items),
    id
  ]);
  
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
  const [rows]: any = await pool.execute('SELECT status FROM jobs WHERE id = ?', [id]);
  const job = rows[0];
  if (!job) return;
  const currentIndex = statusOrder.indexOf(job.status);
  if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
    const nextStatus = statusOrder[currentIndex + 1];
    await pool.execute('UPDATE jobs SET status = ? WHERE id = ?', [nextStatus, id]);
    revalidatePath('/portal');
  }
}

export async function updateJobStatus(id: number, newStatus: string) {
  if (statusOrder.includes(newStatus)) {
    await pool.execute('UPDATE jobs SET status = ? WHERE id = ?', [newStatus, id]);
    revalidatePath('/portal');
  }
}

export async function createJob(data: any) {
  const status = data.status || 'Felvételre vár';
  await pool.execute(`
    INSERT INTO jobs (name, phone, email, address, map_link, status, total, notes, data_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.name,
    data.phone,
    data.email,
    data.address,
    `https://maps.google.com/?q=${encodeURIComponent(data.address || '')}`,
    status,
    data.total,
    data.notes,
    JSON.stringify(data.items)
  ]);

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
      subject: `Új Érdeklődés érkezett: ${data.name}`,
      html: `
        <h2>Új Érdeklődés a Weboldalról</h2>
        <p><b>Név:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email || 'Nincs megadva'}</p>
        <p><b>Telefon:</b> ${data.phone || 'Nincs megadva'}</p>
        <p><b>Cím:</b> ${data.address || 'Nincs megadva'}</p>
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
  const [rows]: any = await pool.query('SELECT * FROM settings');
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
  await pool.execute(`
    INSERT INTO settings (\`key\`, value) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE value = VALUES(value)
  `, [key, strValue]);
  revalidatePath('/portal/settings');
  revalidatePath('/'); // assuming settings affect website
}

export async function getReviews() {
  const [rows]: any = await pool.query('SELECT * FROM google_reviews ORDER BY id DESC');
  return rows;
}

export async function addReview(data: any) {
  await pool.execute('INSERT INTO google_reviews (reviewer_name, rating, text) VALUES (?, ?, ?)', [
    data.reviewer_name,
    data.rating,
    data.text
  ]);
  revalidatePath('/portal/reviews');
  revalidatePath('/');
}

export async function deleteReview(id: number) {
  await pool.execute('DELETE FROM google_reviews WHERE id = ?', [id]);
  revalidatePath('/portal/reviews');
  revalidatePath('/');
}
