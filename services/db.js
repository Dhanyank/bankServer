//database connection

//import mongoose
const mongoose=require('mongoose')

//connction string to connect db with string'
mongoose.connect('mongodb://localhost:27017/bankServer',{

useNewUrlParser:true})

//create model   -singular name of Users(collection name)

const User=mongoose.model('User',
{  acno: Number,
     uname: String, 
     pwd: String,
      balance: Number, 
      transaction:[]
    
} 
)

    module.exports={
        User
    }


