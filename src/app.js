const express=require('express')
const cors=require('cors');
const dotenv=require('dotenv').config();
const checkToken=require('./controller/checkToken')
const PORT=process.env.PORT;
app=express()
app.use(cors());
app.use(express.json())
const router=require('./routes/user')
const route=require('./routes/userPath')
const mongoose =require( 'mongoose');
mongoose.connect('mongodb://localhost:27017/Users');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected");
});



app.use('/',router)
app.use('/user',checkToken.auth,route)

app.listen(PORT,()=>{
    console.log(`App Listening to port ${PORT}...`);
})