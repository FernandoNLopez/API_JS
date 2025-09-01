import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from './env.js';


/* 
The Token bucket is an algorithm based on a specific number of tokens. Each request withdraws a token from the bucket and the bucket is refilled at a fixed rate. 
Once the bucket is empty, the client is blocked until the bucket refills.
*/

const aj = arcjet({
    key: ARCJET_KEY, //get the key
    characteristics: ["ip.src"], //track request by IP Address
    rules: [
        shield({  mode: "LIVE"  }), //shield protects from common things
        //bot protection
        detectBot({
             mode: "LIVE",
             allow: [
                "CATEGORY:SEARCH_ENGINE", //NAVIGATORS, GOOGLE, EXPLORER, BING, ECT
             ] 
            }), 
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ]
});

export default aj;