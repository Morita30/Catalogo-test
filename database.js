let cart = {};
let fCat = 'todas', fMarca = 'todas';

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    renderProductos();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('bus').addEventListener('keyup', ejecutarFiltro);
    document.getElementById('btnSendWa').addEventListener('click', sendWhatsApp);
    document.getElementById('btnCloseModal').addEventListener('click', closeProductModal);
    document.getElementById('productModalOverlay').addEventListener('click', (e) => {
        if(e.target.id === 'productModalOverlay') closeProductModal();
    });
}

// --- FUNCIONES CORE ---
function renderProductos() {
    const cont = document.getElementById('contenedor');
    cont.innerHTML = "";
    productosData.forEach((p) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openProductModal(p.id);
        
        card.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track"><img src="${imgUrlBase}"></div>
            </div>
            <div class="brand-tag">${p.m}</div>
            <h3>${p.n}</h3>
            <div class="price-tag">S/ ${p.p}.00</div>
            <div class="card-buttons">
                <button class="btn-ver-mas">Ver más</button>
                <button class="btn-add-main">Añadir</button>
            </div>
        `;

        // Eventos específicos para que no se abra el modal al añadir
        card.querySelector('.btn-add-main').onclick = (e) => {
            e.stopPropagation();
            addToCart(p.n, p.p, e);
        };
        card.querySelector('.btn-ver-mas').onclick = (e) => {
            e.stopPropagation();
            openProductModal(p.id);
        };

        cont.appendChild(card);
    });
}

function openProductModal(id) {
    const p = productosData.find(x => x.id === id);
    if(!p) return;
    
    document.getElementById('modalBody').innerHTML = `
        <img src="${imgUrlBase}" class="modal-img">
        <h2>${p.n}</h2>
        <p class="modal-oem">OEM: ${p.oem} | Marca: ${p.m.toUpperCase()}</p>
        <div class="info-row"><span class="info-label">Precio:</span><span class="price-highlight">S/ ${p.p}.00</span></div>
        <div class="info-row"><span class="info-label">Compatibilidad:</span><span>${p.compatibilidad}</span></div>
        <div class="info-row"><span class="info-label">Medidas:</span><span>${p.medidas}</span></div>
        <p class="modal-desc">${p.descripcion}</p>
        <button class="btn-add-modal">Añadir al pedido</button>
    `;

    document.querySelector('.btn-add-modal').onclick = (e) => addToCart(p.n, p.p, e);
    document.getElementById('productModalOverlay').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModalOverlay').style.display = 'none';
}

function addToCart(name, price, event) {
    if (cart[name]) cart[name].qty++; else cart[name] = { price, qty: 1 };
    updateCartUI();
    animateFlight(event);
}

function animateFlight(event) {
    const btnCart = document.getElementById('btnCart');
    const rectCart = btnCart.getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'flying-item';
    flyer.style.left = `${event.clientX - 20}px`;
    flyer.style.top = `${event.clientY - 20}px`;
    document.body.appendChild(flyer);

    setTimeout(() => {
        flyer.style.left = `${rectCart.left + (rectCart.width/2) - 20}px`;
        flyer.style.top = `${rectCart.top + (rectCart.height/2) - 20}px`;
        flyer.style.transform = 'scale(0.1)';
        flyer.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        flyer.remove();
        btnCart.classList.add('bounce');
        setTimeout(() => btnCart.classList.remove('bounce'), 200);
    }, 700);
}

function updateCartUI() {
    // Lógica de actualización de lista y total...
    const count = Object.values(cart).reduce((acc, curr) => acc + curr.qty, 0);
    document.getElementById('cartBadge').innerText = count;
}

function sendWhatsApp() {
    let msg = "Hola Frenos Dulanto..."; 
    // Lógica de armado de mensaje...
    window.open(`https://wa.me/51947429347?text=${encodeURIComponent(msg)}`, '_blank');
}
