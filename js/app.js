// js/app.js

const contenedorProductos = document.getElementById("contenedorProductos");

const carritoContainer = document.getElementById("carritoContainer");

const total = document.getElementById("total");

const modal = document.getElementById("modalCarrito");

const verCarrito = document.getElementById("verCarrito");

const cerrarModal = document.getElementById("cerrarModal");

const buscador = document.getElementById("buscador");

const filtroCategoria = document.getElementById("filtroCategoria");

const formProducto = document.getElementById("formProducto");

let productos = [];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// FETCH JSON
fetch("data/productos.json")
  .then(response => response.json())
  .then(data => {

    productos = data;

    renderProductos(productos);

  });

// RENDER PRODUCTOS
function renderProductos(array){

  contenedorProductos.innerHTML = "";

  array.forEach(producto => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <img src="${producto.imagen}">

      <div class="cardContenido">

        <h3>${producto.nombre}</h3>

        <p>Categoría: ${producto.categoria}</p>

        <p>$${producto.precio}</p>

        <button onclick="agregarAlCarrito(${producto.id})">
          Agregar al carrito
        </button>

      </div>
    `;

    contenedorProductos.appendChild(card);

  });

}

// AGREGAR AL CARRITO
function agregarAlCarrito(id){

  const producto = productos.find(prod => prod.id === id);

  carrito.push(producto);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  Swal.fire({
    title:"Producto agregado",
    text:`${producto.nombre} agregado al carrito`,
    icon:"success"
  });

}

// MODAL
verCarrito.addEventListener("click", () => {

  modal.style.display = "block";

  renderCarrito();

});

cerrarModal.addEventListener("click", () => {

  modal.style.display = "none";

});

// RENDER CARRITO
function renderCarrito(){

  carritoContainer.innerHTML = "";

  carrito.forEach((producto,index) => {

    const div = document.createElement("div");

    div.className = "itemCarrito";

    div.innerHTML = `
      <p>${producto.nombre} - $${producto.precio}</p>

      <button onclick="eliminarProducto(${index})">
        X
      </button>
    `;

    carritoContainer.appendChild(div);

  });

  calcularTotal();

}

// ELIMINAR PRODUCTO
function eliminarProducto(index){

  carrito.splice(index,1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderCarrito();

}

// TOTAL
function calcularTotal(){

  const totalCompra = carrito.reduce((acc,prod) => {
    return acc + prod.precio;
  },0);

  total.innerText = `Total: $${totalCompra}`;

}

// FINALIZAR COMPRA
document.getElementById("finalizarCompra")
.addEventListener("click", () => {

  if(carrito.length === 0){

    Swal.fire({
      title:"Carrito vacío",
      icon:"warning"
    });

    return;
  }

  Swal.fire({
    title:"Compra realizada",
    text:"Gracias por comprar en GameStore",
    icon:"success"
  });

  carrito = [];

  localStorage.removeItem("carrito");

  renderCarrito();

});

// BUSCADOR
buscador.addEventListener("input", () => {

  const valor = buscador.value.toLowerCase();

  const filtrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(valor)
  );

  renderProductos(filtrados);

});

// FILTRO CATEGORÍA
filtroCategoria.addEventListener("change", () => {

  const categoria = filtroCategoria.value;

  if(categoria === "todos"){

    renderProductos(productos);

    return;
  }

  const filtrados = productos.filter(prod =>
    prod.categoria === categoria
  );

  renderProductos(filtrados);

});