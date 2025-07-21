document.addEventListener('DOMContentLoaded', function() {
    // Toggle del menú hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Cerrar el menú al hacer clic en un enlace (para móviles)
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    // Datos de los servicios
    const services = [
        {
            id: 1,
            title: "Asesoramiento Profesional",
            image: "assets/img/carrito/servicio1.jpg",
            detail: "Renovación y armado de cartas de bebidas. Degustaciones para empresas : Vinos-cervezas-espirituosas-infusiones-quesos- embutidos chocolates - tabacos..",
            price: 120000
        },
        {
            id: 2,
            title: "Degustación particular",
            image: "assets/img/carrito/servicio2.jpg",
            detail: "Eventos privados, cumpleaños, aniversarios Coaching de armado de cavas : Querés invertir en comprar vinos para guardar o armarte tu primera cava? nosotros te ayudamos a elegir en base a tus gustos y presupuesto.",
            price: 140000
        },
        {
            id: 3,
            title: "Degustación particular Full",
            image: "assets/img/carrito/servicio3.jpg",
            detail: "Organizamos una cata/degustación a tu medida, con copas, vinos y tapeos incluidos.",
            price: 380000
        },
        {
            id: 4,
            title: "Copa de vino tinto, cristal",
            image: "assets/img/carrito/copa-tinto.png",
            detail: "Copa de vino tinto de cristal",
            price: 1700
        },
        {
            id: 5,
            title: "Copa de vino blanco, cristal",
            image: "assets/img/carrito/copa-blanco.png",
            detail: "Copa de vino blanco de cristal",
            price: 1500
        },
        {
            id: 6,
            title: "Copa de vino espumante, cristal",
            image: "assets/img/carrito/copa-espumante.png",
            detail: "Copa de vino espumante de cristal",
            price: 1800
        },
        {
            id: 7,
            title: "Decanter",
            image: "assets/img/carrito/decanter.jpg",
            detail: "Decanter de vino 1ltr",
            price: 3700
        }
    ];

    // Carrito de compras
    let cart = [];

    // Elementos del DOM
    const servicesContainer = document.getElementById('services-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('total-amount');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const purchaseModal = document.getElementById('purchase-modal');
    const successModal = document.getElementById('success-modal');
    const purchaseDetails = document.getElementById('purchase-details');
    const confirmPurchaseBtn = document.getElementById('confirm-purchase');
    const cancelPurchaseBtn = document.getElementById('cancel-purchase');
    const closeSuccessBtn = document.getElementById('close-success');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Renderizar servicios
    function renderServices() {
        servicesContainer.innerHTML = '';
        
        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            
            serviceCard.innerHTML = `
                <div class="service-img" style="background-image: url('${service.image}')"></div>
                <div class="service-info">
                    <h3>${service.title}</h3>
                    <p>${service.detail}</p>
                    <p class="service-price">$${service.price.toLocaleString('es-AR')}</p>
                    <button class="add-to-cart" data-id="${service.id}">Agregar al carrito</button>
                </div>
            `;
            
            servicesContainer.appendChild(serviceCard);
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Agregar al carrito
    function addToCart(e) {
        const serviceId = parseInt(e.target.getAttribute('data-id'));
        const service = services.find(item => item.id === serviceId);
        
        // Verificar si el servicio ya está en el carrito
        const existingItem = cart.find(item => item.id === serviceId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...service,
                quantity: 1
            });
        }
        
        updateCart();
    }

    // Actualizar carrito
    function updateCart() {
        // Actualizar contador del carrito
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        
        // Actualizar lista de items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = '';
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.title}</span>
                        <span class="cart-item-quantity">x${item.quantity}</span>
                    </div>
                    <div>
                        <span class="cart-item-price">$${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Agregar event listeners a los botones de eliminar
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', removeFromCart);
            });
            
            checkoutBtn.disabled = false;
        }
        
        // Actualizar total
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotalElement.textContent = totalAmount.toLocaleString('es-AR');
    }

    // Eliminar del carrito
    function removeFromCart(e) {
        const serviceId = parseInt(e.target.getAttribute('data-id'));
        const itemIndex = cart.findIndex(item => item.id === serviceId);
        
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            updateCart();
        }
    }

    // Mostrar modal de compra
    function showPurchaseModal() {
        purchaseDetails.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('p');
            itemElement.textContent = `${item.title} x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}`;
            purchaseDetails.appendChild(itemElement);
        });
        
        const totalElement = document.createElement('p');
        totalElement.style.fontWeight = 'bold';
        totalElement.style.marginTop = '15px';
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        totalElement.textContent = `Total: $${totalAmount.toLocaleString('es-AR')}`;
        purchaseDetails.appendChild(totalElement);
        
        purchaseModal.style.display = 'block';
    }

    // Confirmar compra
    function confirmPurchase() {
        purchaseModal.style.display = 'none';
        successModal.style.display = 'block';
        cart = [];
        updateCart();
    }

    // Cerrar modales
    function closeModals() {
        purchaseModal.style.display = 'none';
        successModal.style.display = 'none';
    }

    // Event listeners
    checkoutBtn.addEventListener('click', showPurchaseModal);
    confirmPurchaseBtn.addEventListener('click', confirmPurchase);
    cancelPurchaseBtn.addEventListener('click', () => purchaseModal.style.display = 'none');
    closeSuccessBtn.addEventListener('click', closeModals);
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModals);
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === purchaseModal) {
            purchaseModal.style.display = 'none';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Inicializar
    renderServices();
    updateCart();
});

// Logica agregada para el formulario de contacto
document.querySelector('form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Cambiar texto del botón
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            alert('Mensaje enviado con éxito. ¡Gracias por contactarnos!');
            form.reset();
        } else {
            throw new Error('Error en el envío');
        }
    } catch (error) {
        alert('Hubo un problema al enviar el mensaje. Por favor inténtalo de nuevo más tarde.');
        console.error('Error:', error);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});