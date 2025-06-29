import { serve } from '@hono/node-server';
import app from './routes/index';
import { initializeDatabase, db } from './lib/database';

const port = parseInt(process.env.PORT || '3001');

async function startServer() {
  try {
    // Initialize database
    initializeDatabase();

    // Test database operations
    console.log('🔍 Testing database operations...');
    const dbWorking = db.testDatabase();
    console.log(`Database test result: ${dbWorking ? '✅ PASS' : '❌ FAIL'}`);

    console.log('🚀 Starting Waffle Scraper Service...');
    console.log(`📍 Server running on http://localhost:${port}`);
    console.log('📚 Available endpoints:');
    console.log('  GET  /health                     - Health check');
    console.log('  GET  /profile/:username          - Get Twitter profile (cached)');
    console.log('  GET  /avatar/:username           - Get Twitter avatar only');
    console.log('  POST /profile/:username/refresh  - Force refresh profile');
    console.log('  GET  /profiles                   - Get all cached profiles');

    serve({
      fetch: app.fetch,
      port: port,
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
