export const getProducts = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([{ id: 1, name: "Product A" }, { id: 2, name: "Product B" }]);
    }, 2000);
});
