const { Client } = require('pg')


// production
// 	dsn := "host=localhost user=postgres  dbname=template1 port=5432 sslmode=disable"

	// dsn := "host=postgres user=habrpguser password=pgpwd4habr dbname=habrdb port=5432 sslmode=disable"

 const client = new Client({
     user: 'habrpguser',
     host: 'postgres',
     password:'pgpwd4habr',
     database: 'habrdb',
     port: 5432,
   })


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
