import express from 'express';
import { getProducts, getProductDetail } from './api/products.js';
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
    const isExist = await redis.exists('products');
    if(isExist){
        const cachedProducts = await redis.get('products');
        console.log('Serving from cache');
        if(cachedProducts){
            return res.json({products: JSON.parse(cachedProducts)});
        }
    }
    const products = await getProducts();
    await redis.setex('products',40, JSON.stringify(products));
    res.json({products});
});
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const key = `product:${id}`;
    let product = await redis.get(key);
    if(product){
        console.log('Serving from cache');
        return res.json({product: JSON.parse(product)});
    }
    product = await getProductDetail(id)
    await redis.set(key, JSON.stringify(product));
    res.json({product});;
}
);
app.get("/order/:id", async (req, res) => {
    const productId = req.params.id;
    const key = `product:${productId}`;
    //any mutation to database here
    // like creating new order in database
    // reducing the product stock in database

    await redis.del(key); // invalidate the cache
    return res.json({
        message:`Order placed successfully for product ${productId}, cache invalidated`
    })
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});