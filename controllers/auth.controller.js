import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import {  JWT_SECRET, JWT_EXPIRES_IN  } from '../config/env.js';



//The use of this file is defining de logic of the handlers of the routes for our pages, in a separate and independent way.


export const signUp = async(req, res, next) => {
    /*
    Implement sign up logic
    req.body -> is an object containing data from the client (POST request)

    */


    // it´s a session of Mongoose Transaction not a user session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        /* Logic to create a new user */
        const { name, email, password } = req.body;

        //Check if a user with same credencials already exists
        const existingUser = await User.findOne({ email  });

        if (existingUser) {
            const error = new Error('User already exist');
            error.statusCode = 409; //--> already exist code
            throw error;
        }
        //if the user doesn't exist 

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Atach the session for if something goes wrong, then can enter into de catch block
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });


        await session.commitTransaction();
        session.endSession();

        //Status code 201 -> CREATED
        res.statusCode(201).json({
            success: true,
            message: 'User created succesfully Fern.',
            data: {
                token,
                user: newUsers[0]
            }
        });
        
    } catch (error) {
        //if in some point something goes wrong, don´t do anything about that transaction
        await session.abortTransaction();
        session.endSession();
        next(error); 
    }
    
};



export const signIn = async(req, res, next) => {

    try {
        //destructuring email and passsword
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({ email  });

        //if user doesn´t exists
        if (!user) {
            const error = new Error('User not found Fern.');
            error.statusCode = 404;
            throw error;
        }

        //validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid password Fern.');
            error.statusCode = 401;
            throw error;
        }
        //if pass the validations open the session
        const token = jwt.sign({  userId: user._id  }, JWT_SECRET, {  expiresIn: JWT_EXPIRES_IN  });

        res.status(200).json({
            success: true,
            message: true,
            data: {
                token,
                user,
            }
        });


    } catch (error) {
        next(error);
    }
};

export const signOut = async(req, res, next) => {};