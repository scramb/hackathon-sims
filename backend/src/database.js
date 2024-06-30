// Import the Google Cloud client library
const { BigQuery } = require('@google-cloud/bigquery');

// Create a client
const bigquery = new BigQuery();

async function queryBigQuery() {
  const query = `SELECT name, SUM(number) as total
                 FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
                 WHERE state = 'TX'
                 GROUP BY name
                 ORDER BY total DESC
                 LIMIT 10`;

  // Options for the query
  const options = {
    query: query,
    location: 'US',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log('Query Results:');
  rows.forEach(row => console.log(row));
}

// Call the function to query BigQuery
queryBigQuery().catch(err => {
  console.error('ERROR:', err);
});