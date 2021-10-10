const {Client, Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

const DB = {
    query: function (query, callback){
        pool.connect((err, client, done) => {
            if(err) callback(err,null);
            client.query(query, (err, results) => {
                done()
                if(err) { console.error("ERROR: ", err) }
                if(err) { callback(err,null); }
                callback(null,results.rows)
            })
        });
    },
    queryAs: function(query) {
        return new Promise ((resolve, reject)=>{
            pool.connect((err, client, done) => {
                if(err) reject(err);
                client.query(query, (err, results) => {
                    done()
                    if(err) { console.error("ERROR: ", err) }
                    if(err) { reject(err); }
                    resolve(results.rows);
                })
            });
        })
    }
}
module.exports = DB;