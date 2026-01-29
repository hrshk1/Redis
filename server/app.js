import express from 'express';
import { getProducts } from './api/products.js';
import Redis from 'ioredis';


const app = express();
//create a new Redis instance
export const redis = new Redis({
    host: "redis-16706.c292.ap-southeast-1-1.ec2.cloud.redislabs.com"
    ,port: 16706
    ,password: "s0bhxGnrR2EX1FWuwlmVuyaL4iWDFAWR"
});
redis.on('connect',()=>{
    console.log('Connected to Redis');
});

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.get('/products', async (req, res) => {
    const products = await getProducts();
    res.json({products});
});
    

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});