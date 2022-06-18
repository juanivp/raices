// cuando active jquery lo primero que tengo que poner es 
// $(() =>{todo mi js aca})

// ENTIDADES

class Usuario {
    constructor(nombre, email, flete, telefono) {
        this.nombre = nombre;
        this.email = email;
        this.flete = flete;
        this.telefono = telefono;
    }
}

// VARIABLES

const carrito = [];
const listaUsuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];
const listaProductos = [];

const contenedorCarrito = document.getElementById("carrito-contenedor");
const btnVaciarCarrito = document.getElementById("vaciarCarrito");
const btnSave = document.getElementById("btnSave");
const todosLosProductos = document.querySelector("#prods");
const contadorCarrito = document.getElementById("contadorCarrito");
const precioTotal = document.getElementById("precioTotal");
const btnfinalizarCompra = document.getElementById("finalizarCompra");

// FUNCIONES

const obtenerDatosUsuario = () => {
    let nombre = document.querySelector("#inputNombre").value;
    let correoElectronico = document.querySelector("#inputEmail").value;
    let flete = document.querySelector("#provinciaInput").value;
    let telefono = document.querySelector("#inputTelefono").value;

    let nuevoUsuario = new Usuario(nombre, correoElectronico, flete, telefono);
    console.log(nuevoUsuario);
    listaUsuarios.push(nuevoUsuario)
    localStorage.setItem("Usuarios", JSON.stringify(listaUsuarios));
    return nuevoUsuario;
}

//FUNCION PARA TRAER LA LISTA DE PRODUCTOS DEL JSON Y AGREGARLOS AL HTML
const importarProductos = () => {
    fetch("./js/listaProductos.json")
        .then(response => response.json())
        .then(result => {
            let datos = result;
            listaProductos.push(...datos);
            datos.forEach(prod => {
                let nodo = document.createElement("div");
                nodo.setAttribute("class", "card col-12 col-sm-6 col-md-4 col-lg-3 border border-2 m-1");
                nodo.innerHTML = `
                                        <img src="./images/${prod.nombre}.png" class="card-img-top img-thumbnail img-fluid" width="100em" height="100em">
                                        <div class="card-body">
                                            <p class="card-body text-center h3">${prod.nombre}</p>
                                        </div>
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item"><strong>Peso: </strong>${prod.peso} gr</li>
                                            <li class="list-group-item"><strong>Precio: </strong>$${prod.precio}</li>
                                            <li class="list-group-item"><strong>Envase: </strong>${prod.envase}</li>
                                            <button type="button" class="btn btn-outline-success m-1" data-mdb-ripple-color="dark" id="agregar${prod.id}">Matanga!</button>
                                            </li>
                                        </ul>
                            `;
                todosLosProductos.appendChild(nodo);
                // // despues de appendear el nodo, llamo al boton + y le agrego la funcion que agrega producos al carrito cuando clickeo en el
                const boton = document.getElementById(`agregar${prod.id}`);
                boton.addEventListener(`click`, () => {
                    agregarAlCarrito(prod.id)
                })
            })
        })
        .catch(error => console.log(error));
}

//funcion para agregar productos al carrito
const agregarAlCarrito = (elId) => {
    const item = listaProductos.find((el) => (el.id === elId));
    carrito.push(item);
    localStorage.setItem("Carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

//funcion para borrar productos del carrito
const eliminarDelCarrito = (elId) => {
    const item = carrito.find((el) => (el.id === elId));
    const indice = carrito.indexOf(item);
    carrito.splice(indice, 1);
    localStorage.setItem("Carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

//funcion que actualiza datos de mi carrito y crea los nodos
const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    precioTotal.innerHTML = 0;
    carrito.forEach((prod) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <tr>
                <th scope="row"><img src="./images/${prod.nombre}.png" class="card-img-top"></th>
                <td>${prod.nombre}</td>
                <td>$${prod.precio}</td>
                <td>
                    <button class="btn btn-dark" onclick="eliminarDelCarrito(${prod.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </button>
                </td>
            </tr>
            `;
        precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio, 0);
        contenedorCarrito.appendChild(tr);
    })
    contadorCarrito.innerText = carrito.length;
}

//funcion para vaciar el carrito

const vaciar = () => {
    carrito.length = 0;
    precioTotal.innerText = 0;
    localStorage.setItem("Carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

// EVENTOS

//carga de elementos al html
window.addEventListener('DOMContentLoaded', () => {
    importarProductos();
    actualizarCarrito();
});

// EVENTO DEL BOTON DEL FORMULARIO PARA ALMACENAR LA INFO DEL USUARIO
btnSave.addEventListener("click", (e) => {
    e.preventDefault();
    obtenerDatosUsuario();
    swal("Nos comunicaremos pronto", "...un placer conocerte :)");
});

//evento para el boton de borrar del carrito

btnVaciarCarrito.addEventListener("click", () => {
    swal("Segurx que quieres borrar tu seleccion?", {
        buttons: {
            cancel: "Si, estoy segurx",
            catch: {
                text: "Prefiero mantenerla",
                value: "mantiene",
            },
        },
    })
        .then((value) => {
            switch (value) {

                case "mantiene":
                    swal("Tu carrito sigue vigente", "Puedes seguir navegando", "success");
                    break;

                default:
                    swal("Carrito borrado con exito");
                    vaciar();
            }
        });

});

// evento finalizar compra

btnfinalizarCompra.addEventListener("click", (e) => {
    e.preventDefault;
    vaciar();
    swal("Gracias por confiar en nosotrxs!", "Nos comunicaremos contigo para coordinar el envio", "success");
});

