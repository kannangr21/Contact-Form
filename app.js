const express = require('express')
require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express()

app.use(express.json())

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');


const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const appendSpreadsheet = async (row) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    
    await doc.loadInfo();

    const sheet = doc.sheetsById[SHEET_ID];
    const result = await sheet.addRow(row);
  } catch (e) {
    console.error('Error: ', e);
  }
};

app.post('/', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    appendSpreadsheet([name, email, message]);
    res.sendStatus(200);
});

app.listen(process.env.PORT);