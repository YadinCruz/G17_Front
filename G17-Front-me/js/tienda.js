import { ENVIO_GRATIS_DESDE,tarifaPorZona, costoDeEnvio } from "./envio.js";
export { ENVIO_GRATIS_DESDE,tarifaPorZona, costoDeEnvio };
export const IGV = 0.18;

export const precioConIgv = (precio) => precio * (1 + IGV);


export const buscar = (items, texto) => items.filter(({nombre}) => nombre.toLowerCase().includes(texto.toLowerCase()));
export const masCaro = (items) => items.reduce((mayor, p) => (p.precio > mayor.precio ? p : mayor), items[0]);
export const agregarProducto = (items, nuevoProducto) => [...items, nuevoProducto];
export const sumar = (...precios) => precios.reduce((suma, n) => suma + n, 0);
export const actualizarPrecio = (producto, precio) => ({...producto, precio});

export const conDescuento = (precio, porcentaje = 10) => precio - precio * (porcentaje / 100);

export const resumenTienda = (items) => {
    const disponibles = items.filter(({stock}) => stock > 0);
    const agotados = items.length - disponibles.length;
    const valorCatalogo = sumar(...items.map(({precio}) => precio));
    const valorInventario = items.reduce((suma, {precio, stock}) => suma + precio * stock, 0);
    const { nombre : masCaroDe } = masCaro(items);
    return {
        productos : items.length,
        disponibles : disponibles.length, 
        agotados,
        valorCatalogo,
        valorInventario,
        masCaroDe,
    };
};
export const fichaCorta = ({nombre,marca,precio,envio: { zona, dias }
}) => `${nombre} - ${marca} - ${precio} - Envío: ${zona}, ${dias} día(s)`;

export const agruparPorCategoria = (items) =>
    items.reduce((grupos, producto) => ({
        ...grupos,
        [producto.categoria]: [
            ...(grupos[producto.categoria] ?? []),
            producto
        ]
    }), {});

export const aplicarDescuentoA = (items, categoria, porcentaje = 10) =>
    items.map((producto) =>
        producto.categoria === categoria
            ? {
                ...producto,
                precio: producto.precio * (1 - porcentaje / 100)
            }
            : producto
    );