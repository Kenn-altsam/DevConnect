require('dotenv').config();

const app = require('./app');

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`DevConnect KZ backend listening on http://localhost:${port}`);
});
