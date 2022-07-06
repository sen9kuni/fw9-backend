require('dotenv').config();
const express = require('express');
global.__basepath = __dirname;


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('assets'));

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Backend Zwallet running well'
  });
});

app.use('/', require('./src/routes'));

app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'resource not found'
  });
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on post ${process.env.PORT}`);
});