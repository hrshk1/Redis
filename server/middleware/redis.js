import {redis} from "../app.js"; // obtain the redis instance
//from async onwards the function is returned
export const getCachedData = (key) => async(req, res, next) => {
    let data = await redis.get(key);

    if(data){
        console.log("get from cache")
        return res.json({
            products: JSON.parse(data),
        });
        // if data is found then we simply return the response and next() will not be called
    }
    next();
};


// to make this function usable for many other functions in the server we'll pass key parameter as well in the form of object otherwise it will be difficult to manage multiple rate limiters for different routes since they will be saving data in redis with same key
export const rateLimiter = ({limit, time, key}) => async (req,res,next)=>{
     //rate limiter
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const fullKey = `${clientIp}:${key}:request_count`;
    const requestCount = await redis.incr(fullKey);
    //in redis while using incr if the key is not present it will create the key with value 0 and then increment it by 1
    if(requestCount === 1){
        await redis.expire(fullKey,time); // set expiry of 1 minute for the key
    }
    const timeRemaining = await redis.ttl(fullKey);
    console.log(clientIp);
    if(requestCount >limit){
        return res.status(429).send('Too many requests. Please try again after '+timeRemaining+' seconds.');
    }
    next();
}

