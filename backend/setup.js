const { Client } = require('pg');

async function setup() {
  const client = new Client({
    connectionString: 'REMOVED',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase');
    
    // Простая таблица track
    await client.query(`
      CREATE TABLE IF NOT EXISTS track (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        artist VARCHAR NOT NULL,
        duration INTEGER NOT NULL,
        "urlFile" VARCHAR,
        genre VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created track table');
    
    // Простая таблица playlist
    await client.query(`
      CREATE TABLE IF NOT EXISTS playlist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL
      )
    `);
    console.log('✅ Created playlist table');
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

setup();