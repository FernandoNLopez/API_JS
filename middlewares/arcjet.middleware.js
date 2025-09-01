import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {

    try {
        
        const decision = await aj.protect(req, {  requested: 1  }); //denied or true

        if (decision.isDenied()) { //figure out what is the reason for the denied to request
            if (decision.reason.isRateLimit()) return res.status(409).json({ error: 'Rate limit excedeed.' });
            if (decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected.' });

            return res.status(403).json({ error: 'Access denied Fern.' });
        }

    } catch (error) {
        console.log(`Arcjet Middleware Error Fern: ${error}`);
        next(error);
    };
};

export default arcjetMiddleware;

