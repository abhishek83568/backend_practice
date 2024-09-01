const express=require('express');
const connection = require('./Config/db');
const userRouter = require('./Routes/user.route');
const productRouter = require('./Routes/product.route');
const Auth = require('./Middlewares/Auth.middleware');
const dotenv=require('dotenv').config();
const cors=require('cors')

const PORT=process.env.PORT ||7900;
const app=express()
const corsOptions={
    origin:'*',
    methods:['GET','PATCH','PUT','POST','DELETE'],
    credentials:true

}
app.use(cors(corsOptions))
app.use(express.json());
app.use('/user',userRouter)
app.use('/product',Auth,productRouter)


app.get('/',(req,res)=>{
    try {
        res.status(200).send('server is working fine')
    } catch (error) {
        console.log(error)
        res.status(500).send(`Error while running server ${error}`)
        
    }
})

app.listen(PORT,async()=>{
    try {
        await connection
        console.log(`Server is working on PORT ${PORT} and database is also working fine`)
    } catch (error) {
        console.log(error)
    }
})