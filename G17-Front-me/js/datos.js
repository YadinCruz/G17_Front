export const categorias = ["laptops", "smartphones", "tablets", "mobile-accesories"];
export const productos = [
    {id: 1, nombre: "Macbook Pro 14", marca: "Apple", precio: 1999.99, categoria: "laptops", stock: 5, destacado: true, 
        envio : {zona: "Lima", dias : 1}, 
        imagen : "https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp",
        alt : "Macbook Pro 14 pulgadas gris espacial" 
    },
    {id: 2, nombre: "Iphone 13 Pro", marca: "Apple", precio: 1099.99, categoria:"smartphones", stock: 8, destacado: false,
        envio: {zona : "Lima", dias : 1},
        imagen : "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",
        alt:"iPhone 13 Pro"
    },
    {id: 3, nombre: "Ipad Mini 2021", marca: "Apple", precio: 499.99, categoria: "tablets", stock: 0, destacado:false,
        envio: {zona: "Resto del Peru", dias: 4 },
        imagen : "https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp",
                 alt : "iPad Mini 2021" 
    },
    {id: 4, nombre: "Airpods Max", marca: "Apple", precio: 549.99, categoria: "audio", stock: 3, destacado: false,
        envio: {zona: "Lima", dias: 1}, 
        imagen : "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
        alt : "AirPods Max plateados"
    },
    {id: 5, nombre: "Macbook Air 13", marca: "Apple", precio: 1299.99, categoria: "laptops", stock: 4, destacado: false, 
        envio: {zona: "Resto del Peru", dias: 4},
    },
    {id: 6, nombre: "Iphone 15", marca: "Apple", precio: 999.99, categoria: "smartphones", stock: 0, destacado: false,
        envio : { zona : "Internacional", dias : 10},
    },
    {id: 7, nombre: "Laptop Lenovo", marca: "Lenovo", precio: 1899.90, categoria: "laptops", stock: 5, destacado: false,
        envio: {zona: "Lima", dias: 1}, imagen: "img/Lenovo8GB.jpeg", alt: "Laptop Lenovo con procesador Intel Core i5, 8 GB de RAM y 512 GB SSD"},
    {id: 8, nombre: "Laptop ASUS", marca: "ASUS", precio: 1699.90, categoria: "laptops", stock: 5, destacado: false,        
        envio: {zona: "Lima", dias: 1}, imagen: "img/Asus.jpeg", alt: "Laptop ASUS con procesador AMD Ryzen 5, 16 GB de RAM y 512 GB SSD"},
];

export const contarPorCategoria = (items) => 
    items.reduce((cuenta, {categoria}) => ({...cuenta, [categoria] : (cuenta[categoria] ?? 0) + 1}),{});
