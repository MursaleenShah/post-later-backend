const express = require('express');
const cookieparser = require('cookie-parser')
const mongodbConnection = require('./config/database');
const {userRouter} = require('./routes/userRoute');
const {postRouter} = require('./routes/postRoute')
const cookieParser = require('cookie-parser');
const {runScheduler} = require('./scheduler');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // Allow only your frontend
  credentials: true,                // Allow cookies
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
//app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173',  // Allow only your frontend
//   credentials: true,                // Allow cookies
// }));
mongodbConnection();
app.use('/api/user',userRouter);
app.use('/api/post',postRouter);
runScheduler();


app.listen(3000,function(){
    console.log("server is running on port")
})