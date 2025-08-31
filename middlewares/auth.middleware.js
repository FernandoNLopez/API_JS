import jwt from 'jsonwebtoken';

import {  JWT_SECRET  } from '../config/env.js';

/* Basically, this script is finding the user based on the token of the user genereated when is trying to make the request.
    If the the token is there, the user too and attaches it to the request. For knowing exactly who is making a request.

    someone is making request -> authorize middle => verify -> if valid -> next -> get access to user details 
    */


const authorize = async(req, res, next) => {

    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.authorization.split(' ')[1];
        }
        
        if (!token) return resizeBy.status(401).json({ message: 'Unauthorized Fernando.' });

        const decoded = jwt.verify(token, JWT_SECRET);

        //check if the user exist
        const user = await User.findbyId(decoded.userId);

        //if doesn´t exist
        if (!user) return res.status(401).json({ message: 'User does not exist Fern.'  });

        //if exist
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Unauthorized Fern.', error: error.message });
    }
}

export default authorize;