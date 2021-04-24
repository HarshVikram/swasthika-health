const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const db = require('./database/db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use((error, req, res, next) => {
    console.log('[Error handler (last)]', error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 5000;
(async () => {
  try {
  	await db.initialize();
  	app.listen(PORT, () => {
	  console.log(`Server is running on port ${PORT}.`);
	});
  } catch (err) {
  	console.log(err);
  }
})();
