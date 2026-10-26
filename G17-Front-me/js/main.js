import { agregarAlCarrito, faltaParaEnvioGratis, guardarCarrito, leerCarrito, olvidarCarrito, quitarDelCarrito, resumenCarrito } from "./carrito.js";
import { categorias, contarPorCategoria, productos } from "./datos.js";
import formatearPrecio from "./formato.js";
import { ENVIO_GRATIS_DESDE, agregarProducto, fichaCorta,agruparPorCategoria, aplicarDescuentoA} from "./tienda.js";
import { filaCarrito, tarjetaProducto, esqueletoTarjeta, avisoCatalogo, avisoError } from "./ui.js";
import { obtenerProductos } from "./api.js";
const resumenCabecera = document.querySelector('#resumen-carrito');
const listaCarrito = document.querySelector('#lista-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const barraEnvio = document.querySelector('#barra-envio');
const mensajeEnvio = document.querySelector('#mensaje-envio');
const botonVaciar = document.querySelector('#vaciar');
const grillaCatalogo = document.querySelector("#catalogo-grid");
const estadoCatalogo = document.querySelector("#estado-catalogo");
const filtrosCategorias = document.querySelector("#filtros-categorias");

let catalogo = [];
const mensajeDeError = (error) => {
    if(error.name === "TypeError") {
        return ("No pudimos conectarnos con la tienda. Revisa tu conexion y vuelve a intentarlo.");
    }
    if(error.name === "TimeoutError") {
        return "El servidor tardo demasiado en responde. Vuelve a intentarlo en un momento";
    }
    return error.message;
}
let avisoSinResultados = null;

const pintarCatalogo = (lista = catalogo) => {
    avisoSinResultados?.remove();
    avisoSinResultados = null;

    grillaCatalogo.innerHTML = "";

    if (lista.length === 0) {
        avisoSinResultados = document.createElement("p");
        avisoSinResultados.textContent =
            "No se encontraron productos en esta categoría.";

        grillaCatalogo.append(avisoSinResultados);
        grillaCatalogo.setAttribute("aria-label", "Catálogo sin resultados");
        return;
    }

    const html = lista.map(tarjetaProducto).join("");
    grillaCatalogo.insertAdjacentHTML("beforeend", html);

    grillaCatalogo.setAttribute(
        "aria-label",
        `Catálogo con ${lista.length} productos`
    );
};

filtrosCategorias.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-categoria]");
    if (!boton) return;

    const categoria = boton.dataset.categoria;

    console.log("Categoría elegida:", categoria);
    console.log("Categorías disponibles:", [...new Set(catalogo.map(p => p.categoria))]);

    if (categoria === "todas") {
        pintarCatalogo();
        mostrarExito(catalogo);
        return;
    }

    const listaFiltrada = catalogo.filter(
        (producto) => producto.categoria === categoria
    );

    pintarCatalogo(listaFiltrada);

    estadoCatalogo.textContent = listaFiltrada.length === 0
        ? "No hay productos en esta categoría."
        : `Mostrando ${listaFiltrada.length} producto(s).`;
});

const mostrarCargando = () => {
    grillaCatalogo.innerHTML = esqueletoTarjeta().repeat(8);
    estadoCatalogo.innerHTML = avisoCatalogo("Cargando productos...");
}
const mostrarExito = (lista) => {
    const cuenta = contarPorCategoria(lista);
    const detalle = categorias.map((categoria) => `${categoria} ${cuenta[categoria] ?? 0}`).join(" - ");
    estadoCatalogo.innerHTML = avisoCatalogo(`${lista.length} productos - ${detalle}`);
}
const mostrarVacio = () => {
    grillaCatalogo.innerHTML = "";
    estadoCatalogo.innerHTML = avisoCatalogo("No hay productos para mostrar");
}
const mostrarError = (error) => {
    grillaCatalogo.innerHTML = "";
    estadoCatalogo.innerHTML = avisoError(mensajeDeError(error));
}

const cargarCatalogo = async () => {
    mostrarCargando();
    try {
        catalogo = await obtenerProductos();
        if (catalogo.length === 0){
            mostrarVacio();
            return;
        }
        pintarCatalogo();
        mostrarExito(catalogo);
    } catch (error) {
        console.warn("No se pudo cargar el catalogo");
        mostrarError(error);
    } finally {
        console.log("La carga termino, bien o mal. Esta linea corre siempre");
    }
}
estadoCatalogo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion='reintentar']");
    if(!boton) return;
    cargarCatalogo();
})
let carrito = leerCarrito();

const pintarCarrito = () => {
    const {unidades, subTotal, igv, envio, total}= resumenCarrito(carrito);
    resumenCabecera.textContent = unidades === 0 ? "Carrito vacio" : `${unidades} producto(s) - ${formatearPrecio(total)}`;
    listaCarrito.innerHTML = carrito.map(filaCarrito).join("");
    totalCarrito.textContent = unidades === 0 ? "Todavia no agregaste nada." : 
        `Subtotal ${formatearPrecio(subTotal)} - IGV ${formatearPrecio(igv)} - ` +
        `Envio ${formatearPrecio(envio)} - Total ${formatearPrecio(total)}`;
    botonVaciar.classList.toggle("hidden", unidades === 0);
    const avance = Math.min((subTotal/ ENVIO_GRATIS_DESDE) * 100, 100);
    barraEnvio.style.width = `${avance}%`

    const falta = faltaParaEnvioGratis(subTotal);
    mensajeEnvio.textContent = falta === 0 ? "Tu pedido ya tiene envio gratis." : `Te faltan ${formatearPrecio(falta)} para el envio gratis.`;
    document.title = `(${unidades}) TechCart`;
}

grillaCatalogo.addEventListener('click', (evento) => {
    const boton = evento.target.closest("button[data-accion='agregar']");
    if(!boton) return;

    const id = Number(boton.dataset.id);
    const producto = catalogo.find( p => p.id === id);
    if(!producto) return;

    carrito = agregarAlCarrito(carrito , producto);
    guardarCarrito(carrito);
    pintarCarrito();
});

listaCarrito.addEventListener('click', (evento) => {
    const boton = evento.target.closest("button[data-accion='quitar']");
    if(!boton) return;

    carrito = quitarDelCarrito(carrito, Number(boton.dataset.posicion));
    guardarCarrito(carrito);
    pintarCarrito();
});

botonVaciar.addEventListener('click', () => {
    carrito = [];
    olvidarCarrito();
    pintarCarrito();
})

const formularioCompra = document.querySelector('#form-compra');
const estadoPedido = document.querySelector('#estado-pedido');

const mostrarAviso = (mensaje, esError) => {
    estadoPedido.querySelector("p")?.remove();
    const aviso = document.createElement("p");
    aviso.textContent = mensaje;
    aviso.classList.add("font-semibold", esError ? "text-error" : "text-exito");
    estadoPedido.append(aviso);
}

formularioCompra.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if(!formularioCompra.checkValidity()){
        formularioCompra.reportValidity();
        mostrarAviso("Faltan datos por completar. Revisa los campos marcados", true);
        return;
    }

    if(carrito.length === 0 ) {
        mostrarAviso("Tu carrito esta vacio: Agrega al menos un producto antes de confirmar.", true);
        return;
    }

    const datos = new FormData(formularioCompra);
    const nombre = datos.get("nombre");
    const unidades = Number(formularioCompra.elements.cantidad.value);
    const {total} = resumenCarrito(carrito);

    mostrarAviso(
        `
        Gracias, ${nombre}. Tu pedido de ${carrito.length} producto(s) y ${unidades} unidad(es) 
        ` + 
        `por ${formatearPrecio(total)} quedo registrado.`, false
    );
    formularioCompra.reset();

})
pintarCarrito();
cargarCatalogo();


const productoNuevo = {
    id: 9,
    nombre: "ThinkPad X1 Carbon",
    marca: "Lenovo",
    precio: 1499.99,
    categoria: "laptops",
    stock: 6,
    destacado: true,
    envio: { zona: "Lima", dias: 1 },
    imagen: "",
    alt: "Laptop Lenovo ThinkPad X1 Carbon"
};

const productosPrueba = agregarProducto([], productoNuevo);

console.log("Cantidad de productos:", productosPrueba.length);
console.log("Stock del producto:", productosPrueba[0].stock);

const ficha = `
    <article>
        <h3>${productoNuevo.nombre}</h3>
        <p>Marca: ${productoNuevo.marca}</p>
        <p>Precio: ${formatearPrecio(productoNuevo.precio)}</p>
        <p>Stock: ${productoNuevo.stock}</p>
    </article>
`;

console.log(ficha);
console.log("Cantidad de productos:", productos.length);
console.log(fichaCorta(productoNuevo));
console.log("Productos agrupados:", agruparPorCategoria(productos));

const productosConDescuento = aplicarDescuentoA(productos, "laptops", 10);

console.log("Precio original:", productos[0].precio);
console.log("Precio con descuento:", productosConDescuento[0].precio);

console.log(
    "¿Se conserva el objeto de una categoría diferente?",
    productos.find(p => p.categoria === "audio") ===
    productosConDescuento.find(p => p.categoria === "audio")
);