import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import authRoutes from './router/auth.js';
import categoryRoute from './router/categoryRoute.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
connectDB();

//middleware
app.use(express.json());
app.use(morgan('dev'));


//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoute); 
// app.use('/api/v1/product', productRoute); 

app.use('/', (req,res)=>{
    res.send("server is running at localhost")
});

const port = process.env.PORT || 8000;
app.listen(port , ()=>{
        console.log(`server is running at ${port}`.bgGreen);
})
