import { getPool } from './db.js';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  try {
    await getPool().query('SELECT 1');
    return response.status(200).json({
      success: true,
      database: 'connected'
    });
  } catch {
    return response.status(503).json({
      success: false,
      database: 'disconnected'
    });
  }
}
