

//before(error), req, res, after the error
// The concept is Intercepting the error and knowing a more about it
const errorMiddleware = (err, req, res, next) => {

    //create a subscription -> middleware (check something) -> next() -> controller

    try {
        
        let error = { ...err  };

        error.message = err.message;

        console.error(err);

        //type of error 
        // Mongoose bad ObjectId
        if (err.name === 'CastError' ) {
            const message = 'Resource not found';

            error = new Error(message);
            error.statusCode = 404;
        }
        //Mongoose Duplicate Key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';

            error = new Error(message);
            error.statusCode = 400;
        }
        //Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);

            error = new Error(message.join(', '));
            error.statusCode = 400;
        }
        //Return the response with de status
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error, debugging needed.' });

    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;