import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rubicon',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initializeDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        \`key\` VARCHAR(255) PRIMARY KEY,
        value TEXT
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        email VARCHAR(255),
        address TEXT,
        map_link TEXT,
        status VARCHAR(255) DEFAULT 'Felvételre vár',
        total INT DEFAULT 0,
        notes TEXT,
        data_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS google_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reviewer_name VARCHAR(255),
        rating INT,
        text TEXT,
        highlighted INT DEFAULT 0
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS seo_pages (
        slug VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        h1 VARCHAR(255),
        content_markdown TEXT
      )
    `);

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

    for (const [key, value] of defaultSettings) {
      await connection.execute(
        'INSERT IGNORE INTO settings (\`key\`, value) VALUES (?, ?)',
        [key, value]
      );
    }

    connection.release();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

initializeDb();

export default pool;
