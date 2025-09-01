import express from 'express';
import cookieParser from 'cookie-parser';
//env
import {  PORT  } from './config/env.js';
//routes
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
//db
import connectToDatabase from './database/mongodb.js';
//server
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';




const app = express();

app.use(express.json()); // -> allows app to handle json data sent in request
app.use(express.urlencoded({ extended: false })); //help us to process the data html -> simple form
app.use(cookieParser()); // reads cookies from incoming request -> app can store user data  
app.use(arcjetMiddleware);


//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

//middleware
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send("Hola Fer");
});

app.listen(PORT, async () => {
    console.log(`Tracker running on port 3000 Fern: http://localhost:${PORT}`);

    await connectToDatabase();
});



export default app; 
