export const getProducts = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([{ id: 1, name: "Product A" }, { id: 2, name: "Product B" }]);
    }, 2000);
});

export const getProductDetail = (id) => new Promise ((resolve,reject)=>{
    setTimeout(() => {
        resolve({
            product:{
                id:id,
                name:`Product${id}`,
                price:Math.floor(Math.random()*id*100),
            },
        });
    }, 2000);
});