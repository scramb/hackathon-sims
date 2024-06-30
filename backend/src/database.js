// Import the Google Cloud client library
const { BigQuery } = require('@google-cloud/bigquery');

const getData = () => new Promise(async (resolve, reject) => {
const bigquery = new BigQuery();

  const query = `SELECT *
                 FROM \`szr-hackathon-sbx-5242.dataset_test.plant_updates\``;

  // Options for the query
  const options = {
    query: query,
    location: 'europe-west4',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  resolve(rows)
})

module.exports = {
  getData
}