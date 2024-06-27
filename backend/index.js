const express = require('express');
const { getPredictions } = require('./src/ai.js')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});

app.post('/', async (req, res) => {
  try {
    const instances = req.body.instances;
    if (!instances) {
      return res.status(400).send('Instances are required');
    }

    // Get predictions
    const predictions = await getPredictions(instances);

    // Insert predictions into Cloud SQL
    await insertPredictions(predictions);

    res.status(200).send('Predictions inserted into Cloud SQL successfully.');
  } catch (error) {
    console.error('Error during prediction or insertion:', error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);