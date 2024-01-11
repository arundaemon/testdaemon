var mongoose = require('mongoose');


//console.log(envConfig)
function connectDb() {
    let promise = new Promise(
        (resolve,reject) => {
            let mongoOptions = {
                autoIndex:true,
                autoCreate:true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize:100,
                minPoolSize:10
                //useCreateIndex: true
            }        
            mongoose.connect(envConfig.MONGO_CONNECTION_STRING, mongoOptions)
                .then(() => {
                    console.log("Successfully connected to the database", envConfig.MONGO_CONNECTION_STRING);
                    if (envConfig.ENVIRONMENT == 'local') {
                        mongoose.set('debug', true);
                    }
                    resolve(true)
                })
                .catch(err => {
                    console.log(envConfig.ENVIRONMENT,envConfig.MONGO_CONNECTION_STRING)
                    console.log('Could not connect to the database. Exiting now...', err);                    
                    reject(false)
                });
            mongoose.set('useFindAndModify', false); // Done for deprecation warning by mongoose
        }
    )   
    return promise 
}

// ========================== Export Module Start ==========================
module.exports = { connectDb };
// ========================== Export Module End ============================


