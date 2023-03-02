const { Client } = require('pg')



// 	dsn := "host=localhost user=postgres  dbname=template1 port=5432 sslmode=disable"

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'template1',
    port: 5432,
  })





const connectWithRetry = function() {

    return client.connect(function(err) {
        if (err) {
            console.error('Failed to connect to pg on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        };
        console.log("Connected to postgres!");
      });


  
};
connectWithRetry();


module.exports = client;
