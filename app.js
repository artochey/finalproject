const express = require('express');
const path = require('path');
const routes = require('./routes');


const app = express();
const PORT = 3000;
app.use(express.json()); //
// Middleware สำหรับให้บริการไฟล์ static เช่น index.html
app.use(express.static(path.join(__dirname, 'public')));

// Routes สำหรับ API
app.use('/api', routes);

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
