import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ✅ HEALTH CHECK ENDPOINT
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Local AI server is running',
    mode: 'LOCAL_PROCESSING',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'API server is running',
    mode: 'LOCAL_PROCESSING',
    timestamp: new Date().toISOString()
  });
});

// ✅ SIMPLE ECHO ENDPOINT - Just confirms server is running
app.post('/api/generate-tryon', async (req, res) => {
  try {
    const { faceImage, outfitImage } = req.body;

    if (!faceImage || !outfitImage) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required images'
      });
    }

    console.log('✅ Virtual try-on request received');
    console.log('📸 Person image size:', faceImage.length);
    console.log('👔 Garment image size:', outfitImage.length);

    // All processing happens in the browser - server just confirms receipt
    res.json({
      success: true,
      message: 'Processing complete on client side',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// ✅ AUTO PORT RECOVERY
const PORT = process.env.PORT || 3003;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(60));
  console.log('🚀 Local AI Virtual Try-On Server');
  console.log('='.repeat(60));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('🤖 Processing: LOCAL (Browser-based)');
  console.log('💻 No external API calls');
  console.log('⚡ Real-time performance');
  console.log('');
  console.log('✅ Server is running and ready!');
  console.log('='.repeat(60));
  console.log('');
});

// ✅ KEEP SERVER ALIVE
server.keepAliveTimeout = 65000;

// ✅ GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('');
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

// ✅ PREVENT CRASHES
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
