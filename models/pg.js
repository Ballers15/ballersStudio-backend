const { Client } = require('pg')


  // prod + staging
  const client = new Client({
    user: 'habrpguser',
    host: '172.19.0.2',
    password:'pgpwd4habr',
    database: 'habrdb',
    port: 5432,
   ssl: false

  })

// local
  // const client = new Client({
  //   user: 'postgres',
  //   host: 'localhost',
  //   database: 'template1',
  //   port: 5432,
  // })




const connectWithRetry = function() {

    return client.connect(function(err) {
        if (err) {
            console.log('Failed to connect to pg on startup - retrying in 5 sec', err);
            // setTimeout(connectWithRetry, 5000);
        }
        else{

          console.log("Postgres Connection Established");
        }
      
      });


  
};
connectWithRetry();


module.exports = client;
