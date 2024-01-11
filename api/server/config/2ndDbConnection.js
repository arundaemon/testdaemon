// -------commented the 2nd DB connection in future requirement would be utilised --------//

// const { MongoClient } = require('mongodb');


// // Connection URL
// const url = 'mongodb://report_dashboard:dashboard%40%21%23M0gUW699@3.7.195.238:17027/test_report_dashboard?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';
// const client = new MongoClient(url);

// // Database Name
// const dbName = 'mbg_India';

// async function connectActivityDb() {
 
//   await client.connect();
//   console.log('Connected successfully to server from mongo client');
//   const db = client.db(dbName);
  
//   // db.collection('activity_logs').find().toArray((err,data) =>{
//   //   db.collection('post_activity').find().toArray((err,data) =>{

//   //   console.log(data,"data....");
//   // }); 
//   // return data
      


  
// //   console.log(collection,"collection");


//   return "done..";
// }

// // const getLongActivity= async () => {
// //   await client.connect();

// //   const db = client.db(dbName);
// //   db.collection('activity_logs').find().toArray((e,data)=>{
// //     //   const getCollection=db.getCollectionNames() 
// //     console.log(data,"longdata")
// //     return data;
// //       });
// // }


//   module.exports = {
//     // connectActivityDb,
//     // getLongActivity,
//     // dbName,
//   };

