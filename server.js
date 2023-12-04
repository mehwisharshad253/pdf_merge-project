const express = require('express')
const path = require('path');
const multer = require('multer');
const { mergePdfs } = require('./merge');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/merge', upload.array('pdfs', 2), async (req, res) => {
  try {
    console.log(req.files);
    await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path));
    res.redirect("http://localhost:3000/static/merged.pdf");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
