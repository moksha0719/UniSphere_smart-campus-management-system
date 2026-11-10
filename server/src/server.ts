import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Smart Campus Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`===============================================`);
});
