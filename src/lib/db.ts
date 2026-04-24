import Database from 'better-sqlite3';
import path from 'path';

// Resolve database path
const dbPath = path.resolve(process.cwd(), 'rubicon.db');

let db!: Database.Database;

try {
  db = new Database(dbPath, { verbose: console.log });

  // Initialize DB tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      map_link TEXT,
      status TEXT DEFAULT 'Felvételre vár',
      total INTEGER DEFAULT 0,
      notes TEXT,
      data_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS google_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reviewer_name TEXT,
      rating INTEGER,
      text TEXT,
      highlighted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS seo_pages (
      slug TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      h1 TEXT,
      content_markdown TEXT
    );
  `);

  try {
    db.exec(`ALTER TABLE jobs ADD COLUMN phone TEXT;`);
  } catch (e: any) {
    // Column might already exist, ignore
  }

  // Default settings insertion
  const defaultSettings = [
    ['company_name', 'Rubicon Szőnyegtisztítás'],
    ['contact_address', ''],
    ['contact_phone', ''],
    ['contact_email', ''],
    ['style_formal', '1'], // 1 = Magázó, 0 = Tegező
    ['whitelisted_emails', JSON.stringify(['whereismaco@gmail.com'])],
    ['delivery_fee_limit', '10000'],
    ['delivery_fee_base', '2000'],
    ['pricing_rug', JSON.stringify({
      types: {
        'Vékony': 1500,
        'Vastag': 1800,
        'Shaggy': 2200
      },
      materials: ['Pamut', 'Gyapjú', 'Kevert', 'Műszálas', 'Selyem'],
      conditions: {
        'Enyhén': 0,
        'Közepesen': 200, // per m2
        'Erősen': 400     // per m2
      },
      extras: {
        'Állatszőr': 500, // per m2 or fix? user says: "Fix vagy m2 alapú"
        'Borfolt': 1000,
        'Kávéfolt': 1000
      }
    })],
    ['pricing_upholstery', JSON.stringify({
      types: {
        'Fotel': 4000,
        'Párna': 1000,
        'Ülőgarnitúra': 2500, // per ülés
        'Franciaágy': 12000,
        'Matrac (90x200)': 4000,
        'Matrac (140x200)': 6000,
        'Matrac (160x200)': 7000,
        'Matrac (180x200)': 8000,
        'Szék': 1500
      },
      options: {
        'Atkaírtás': 2000,
        'Ózonos fertőtlenítés': 3000
      }
    })],
    ['pricing_car', JSON.stringify({
      categories: {
        'Kicsi': 0,
        'Közepes': 2000,
        'Nagy': 4000
      },
      packages: {
        'Belső takarítás': 8000,
        'Kárpittisztítás ülésekre': 12000,
        'Teljes belső kozmetika': 20000
      }
    })],
    ['whitelisted_emails', JSON.stringify(['whereismaco@gmail.com'])]
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  const insertMany = db.transaction((settingsList) => {
    for (const [key, value] of settingsList) {
      stmt.run(key, value);
    }
  });

  insertMany(defaultSettings);

  console.log('Database initialized successfully.');
} catch (error) {
  console.error('Failed to initialize database:', error);
}

export default db;
