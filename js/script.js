document.addEventListener('DOMContentLoaded', function() {
  const toggleCarritoBtn = document.getElementById('toggle-carrito');
  const carrito = document.getElementById('carrito');

  // Para mostrar u ocultar el carrito al hacer clic en el botón
  toggleCarritoBtn.addEventListener('click', function() {
    console.log('Botón del carrito clicado');
    console.log('Antes de toogle:', carrito.classList.contains('visible'));
    carrito.classList.toggle('visible');
    console.log('Después de toggle:', carrito.classList.contains('visible'));
  });

  // Para vaciar el carrito
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  vaciarCarritoBtn.addEventListener('click', function() {
    mostrarConfirmacion('¿Seguro que quieres vaciar el carrito?', vaciarCarrito);
    cerrarCarrito();
  });

  // Para comprar en el carrito
  const comprarBtn = document.getElementById('comprar');
  comprarBtn.addEventListener('click', function() {
    mostrarConfirmacion('¿Deseas proceder con la compra?', function() {
      vaciarCarrito();
      mostrarAlerta('¡Gracias por tu compra!', 'success');  
      cerrarCarrito();
    });
  });

  // Agregar productos al carrito
  const productos = document.querySelectorAll('.btn-comprar');
  productos.forEach(producto => {
    producto.addEventListener('click', function() {
      const nombreProducto = this.parentNode.querySelector('h3').textContent;
      const precioProducto = parseFloat(this.parentNode.querySelector('p').textContent.replace('Precio: $', ''));
      const cartItems = document.getElementById('cart-items');
      const totalCarrito = parseFloat(document.getElementById('total').textContent.replace('Total: $', ''));
      const nuevoTotal = totalCarrito + precioProducto;
      
      carrito.classList.add('visible');

      // Buscar si ya existe un elemento para este producto en el carrito
      let itemExistente = null;
      cartItems.childNodes.forEach(item => {
        if (item.textContent.includes(nombreProducto)) {
          itemExistente = item;
        }
      });
        // Si ya existe, actualizar la cantidad y el precio total
      if (itemExistente) {
        const cantidadActual = parseInt(itemExistente.dataset.cantidad);
        const precioActual = parseFloat(itemExistente.dataset.precioTotal);
        const nuevaCantidad = cantidadActual + 1;
        const nuevoPrecio = precioActual + precioProducto;

        itemExistente.dataset.cantidad = nuevaCantidad;
        itemExistente.dataset.precioTotal = nuevoPrecio;
        itemExistente.textContent = `${nombreProducto} x${nuevaCantidad} - $${nuevoPrecio.toFixed(2)}`;
      } else {
        // Si no existe, crear un nuevo elemento
        const newItem = document.createElement('div');
        newItem.dataset.cantidad = 1;
        newItem.dataset.precioTotal = precioProducto;
        newItem.textContent = `${nombreProducto} x1 - $${precioProducto.toFixed(2)}`;
        cartItems.appendChild(newItem);
      }
    });
  });
});

// Función para vaciar el carrito
function vaciarCarrito() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  actualizarTotalCarrito(0);
}

// Función para mostrar una alerta dinámica con animación
function mostrarAlerta(mensaje, tipo) {
  const alerta = document.createElement('div');
  alerta.classList.add('alerta', `alerta-${tipo}`);
  alerta.textContent = mensaje;

  // Agregar alerta al cuerpo del documento
  document.body.appendChild(alerta);

  // Animación de entrada
  alerta.animate([
    { transform: 'translate(-50%, -100%)', opacity: 0 },
    { transform: 'translate(-50%, 0)', opacity: 1 }
  ], {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'forwards'
  });

  // Desaparecer alerta después de cierto tiempo
  setTimeout(() => {
    alerta.animate([
      { transform: 'translate(-50%, 0)', opacity: 1 },
      { transform: 'translate(-50%, -100%)', opacity: 0 }
    ], {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).onfinish = () => {
      alerta.remove(); // Eliminar la alerta del DOM después de la animación
    };
  }, 3000); // La alerta desaparecerá después de 3 segundos (3000 milisegundos)
}

// Función para mostrar un cartel de confirmación dinámico
function mostrarConfirmacion(mensaje, callback) {
  const confirmacion = document.createElement('div');
  confirmacion.classList.add('confirmacion');
  
  // Crear contenido de la confirmación
  const mensajeConfirmacion = document.createElement('p');
  mensajeConfirmacion.textContent = mensaje;
  confirmacion.appendChild(mensajeConfirmacion);
  
  // Crear botones de confirmación
  const btnConfirmar = document.createElement('button');
  btnConfirmar.textContent = 'Confirmar';
  btnConfirmar.classList.add('btn-confirmar');
  
  const btnCancelar = document.createElement('button');
  btnCancelar.textContent = 'Cancelar';
  btnCancelar.classList.add('btn-cancelar');
  
  // Agregar botones al elemento de confirmación
  confirmacion.appendChild(btnConfirmar);
  confirmacion.appendChild(btnCancelar);
  
  // Agregar confirmación al cuerpo del documento
  document.body.appendChild(confirmacion);
  
  // Botón de confirmar
  btnConfirmar.addEventListener('click', function() {
    callback();
    confirmacion.remove();
    mostrarAlerta('¡Operación realizada con éxito!', 'info');
  });
  
  // Botón de cancelar
  btnCancelar.addEventListener('click', function() {
    confirmacion.remove();
    mostrarAlerta('Operación cancelada.', 'warning');
  });
}

// Función para actualizar el total del carrito
function actualizarTotalCarrito(total) {
  const totalCarrito = document.getElementById('total');
  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para cerrar el carrito
function cerrarCarrito() {
  const carrito = document.getElementById('carrito');
  carrito.classList.remove('visible');
}

