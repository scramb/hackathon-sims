const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const { generateContent } = require('./src/ai.js')
const { getData, addData } = require('./src/database.js')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
  const data = await getData()

  return res.send(data);
});

app.post('/', async (req, res) => {
  if(req.body && req.body.instance) {
    const newInput = await generateContent(req.body.instance)
    addData(newInput)
    return res.send(`Row insert successful`)
  } else {
    res.status(400).send('Wrong Input')
  }
});

app.put('/', async (req, res) => {
  return res.send('Received a PUT HTTP method')
})

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);