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

