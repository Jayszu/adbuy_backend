const mongoose = require ('mongoose')

const connectDatabase = ()=>{
    mongoose.connect('mongodb+srv://jaysuz:Jaypogi123@reactdb.nchuw6s.mongodb.net/eshop-db?retryWrites=true&w=majority',{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        dbName: "eshop-db",
    }).then((data)=>{
        console.log(`database is running`)
    })
    .catch((err) => {
        console.log(err);
      });
}

module.exports = connectDatabase