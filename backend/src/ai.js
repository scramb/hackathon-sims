const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;
const mysql = require('mysql2/promise');

const clientOptions = {
    apiEndpoint: 'your-region-aiplatform.googleapis.com',
  };
const predictionClient = new PredictionServiceClient(clientOptions);
  
// Function to get predictions from the model
async function getPredictions(instances) {
    const endpoint = `projects/your-project-id/locations/your-region/endpoints/your-endpoint-id`;
    const request = {
      endpoint,
      instances,
    };
  
    const [response] = await predictionClient.predict(request);
    return response.predictions;
}

// Function to insert predictions into Cloud SQL
async function insertPredictions(predictions) {
    const connection = await mysql.createConnection({
      host: 'your-cloud-sql-host',
      user: 'your-username',
      database: 'your-database',
      password: 'your-password',
    });
  
    const insertPromises = predictions.map((result) => {
      const sql = "INSERT INTO your_table (column1, column2, ...) VALUES (?, ?, ...)";
      const values = [result.field1, result.field2];  // Adjust according to your prediction output
      return connection.execute(sql, values);
    });
  
    await Promise.all(insertPromises);
    await connection.end();
}

