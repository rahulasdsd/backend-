const mongoose = require('mongoose')

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
    .then(()=>{
        console.log('Monodb connected ........')
    }).catch((err) => {
        console.log(' Mongo Db connected error:',err);
    })