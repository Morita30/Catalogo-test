/**
 * MAIN LOGIC - FRENOS DULANTO
 * Controla el renderizado, filtros, carrusel y carrito.
 */

let cart = {};
let fCat = 'todas', fMarca = 'todas'; 
let touchStartX = 0;

// 1. RENDERIZADO DE PRODUCTOS
function renderProductos() {
    const cont = document.getElementById('contenedor');
    if(!cont) return;
    cont.innerHTML = "";
    
    productosData.forEach((p, i) => {
        cont.innerHTML += `
        <div class="card" data-tipo="${p.c}" data-marca="${p.m}" data-full="${p.n} ${p.m}">
          <div class="carousel-container" id="container-${i}" ontouchstart="handleTouchStart(event, ${i})" ontouchend="handleTouchEnd(event, ${i})">
            <div class="carousel-track" id="track-${i}" data-idx="1" data-cloning="false">
              <img src="${imgUrlBase}"> 
              <img src="${imgUrlBase}"><img src="${imgUrlBase}"><img src="${imgUrlBase}">
              <img src="${imgUrlBase}">
            </div>
            <div class="carousel-indicators">
              <span class="dot active" data-dot="0"></span>
              <span class="dot" data-dot="1"></span>
              <span class="dot" data-dot="2"></span>
            </div>
          </div>
          <div class="brand-tag">${p.m}</div>
          <h3 style="font-size:12px; margin:3px 0; min-height:30px;">${p.n}</h3>
          <div class="price-tag">S/ ${p.p}.00</div>
          <button class="btn-add" onclick="addToCart('${p.n}', ${p.p}, event)">Añadir</button>
        </div>`;
    });
}

// 2. LÓGICA DEL CARRUSEL INFINITO
function handleTouchStart(e, id) { touchStartX = e.changedTouches[0].screenX; }

function handleTouchEnd(e, id) {
    let touchEndX = e.changedTouches[0].screenX;
    let diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) moveCarouselInfinite(id, diff > 0 ? 1 : -1);
}

function moveCarouselInfinite(id, dir) {
    const track = document.getElementById(`track-${id}`);
    const container = document.getElementById(`container-${id}`);
    if (!track || track.getAttribute('data-cloning') === 'true') return;

    const indicators = container.querySelectorAll('.dot');
    let currentIdx = parseInt(track.getAttribute('data-idx'));
    let nextIdx = currentIdx + dir;

    track.classList.remove('no-transition');
    track.style.transform = `translateX(-${nextIdx * 20}%)`;
    track.setAttribute('data-idx', nextIdx);

    // Actualizar indicadores (dots)
    let indicatorIdx = (nextIdx === 4) ? 0 : (nextIdx === 0) ? 2 : nextIdx - 1;
    indicators.forEach(i => i.classList.remove('active'));
    if(indicators[indicatorIdx]) indicators[indicatorIdx].classList.add('active');

    // Efecto infinito (salto sin transición)
    if (nextIdx === 0 || nextIdx === 4) {
        track.setAttribute('data-cloning', 'true');
        setTimeout(() => {
            track.classList.add('no-transition');
            let jumpIdx = (nextIdx === 4) ? 1 : 3;
            track.style.transform = `translateX(-${jumpIdx * 20}%)`;
            track.setAttribute('data-idx', jumpIdx);
            track.setAttribute('data-cloning', 'false');
        }, 400);
    }
}

// 3. FILTROS Y BÚSQUEDA
function ejecutarFiltro() {
    const query = document.getElementById('bus').value.toLowerCase().trim();
    const palabras = query.split(/\s+/); 
    document.querySelectorAll('.card').forEach(c => {
        const txt = c.getAttribute('data-full').toLowerCase();
        const matchCat = (fCat === 'todas' || c.getAttribute('data-tipo') === fCat);
        const matchMar = (fMarca === 'todas' || c.getAttribute('data-marca') === fMarca); 
        const matchBus = palabras.every(p => txt.includes(p)); 
        if (matchCat && matchMar && matchBus) c.classList.remove('hidden'); else c.classList.add('hidden');
    });
}

function setFiltro(tipo, val, txt, el, e) {
    e.stopPropagation();
    if(tipo === 'cat') { 
        fCat = val; 
        document.getElementById('lCat').innerText = txt; 
        document.getElementById('btnCat').classList.toggle('active-filter', val !== 'todas');
    } else { 
        fMarca = val; 
        document.getElementById('lMar').innerText = txt; 
        document.getElementById('btnMar').classList.toggle('active-filter', val !== 'todas');
    }
    const menuId = (tipo === 'cat' ? 'mCat' : 'mMar');
    document.querySelectorAll(`#${menuId} .menu-item`).forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    closeAllMenus();
    ejecutarFiltro();
}

// 4. CARRITO DE COMPRAS
function addToCart(name, price, event) {
    if (cart[name]) cart[name].qty++; else cart[name] = { price, qty: 1 };
    updateCartUI();
    animateFlyer(event);
}

function updateCartUI() {
    const list = document.getElementById('cartList');
    let total = 0, count = 0;
    list.innerHTML = "";
    for (const n in cart) {
        total += cart[n].price * cart[n].qty;
        count += cart[n].qty;
        list.innerHTML += `
        <div class="cart-item">
          <div style="text-align:left; font-size:12px"><strong>${n}</strong><br>S/ ${cart[n].price * cart[n].qty}</div>
          <div style="display:flex; align-items:center; gap:5px">
            <button class="btn-qty" onclick="changeQty('${n}', -1, event)">-</button>
            <span style="font-weight:700">${cart[n].qty}</span>
            <button class="btn-qty" onclick="changeQty('${n}', 1, event)">+</button>
          </div>
        </div>`;
    }
    document.getElementById('cartBadge').innerText = count;
    document.getElementById('totalLabel').innerText = `S/ ${total}`;
}

function changeQty(name, delta, e) {
    e.stopPropagation();
    cart[name].qty += delta;
    if (cart[name].qty <= 0) delete cart[name];
    updateCartUI();
}

function animateFlyer(event) {
    const btnCart = document.getElementById('btnCart');
    const rectCart = btnCart.getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'flying-item';
    flyer.style.left = `${event.clientX - 20}px`;
    flyer.style.top = `${event.clientY - 20}px`;
    document.body.appendChild(flyer);

    setTimeout(() => {
        flyer.style.left = `${rectCart.left + (rectCart.width / 2) - 20}px`;
        flyer.style.top = `${rectCart.top + (rectCart.height / 2) - 20}px`;
        flyer.style.transform = 'scale(0.1)';
        flyer.style.opacity = '0';
    }, 10);
    setTimeout(() => {
        flyer.remove();
        btnCart.style.transform = 'scale(1.3)';
        setTimeout(() => btnCart.style.transform = 'scale(1)', 200);
    }, 700);
}

// 5. UTILIDADES (MENÚS Y WHATSAPP)
function toggleMenu(menuId, btnId, e) {
    e.stopPropagation();
    const menu = document.getElementById(menuId);
    const isShowing = menu.classList.contains('show');
    closeAllMenus();
    if(!isShowing) {
        menu.classList.add('show');
        document.getElementById(btnId).classList.add('open');
    }
}

function toggleCartModal(e) {
    e.stopPropagation();
    const m = document.getElementById('cartModal');
    const isVisible = m.style.display === 'block';
    closeAllMenus();
    m.style.display = isVisible ? 'none' : 'block';
}

function closeAllMenus() {
    document.querySelectorAll('.menu-content').forEach(m => m.classList.remove('show'));
    document.querySelectorAll('.btn-menu').forEach(b => b.classList.remove('open'));
    document.getElementById('cartModal').style.display = 'none';
}

function sendWhatsApp() {
    let msg = "Hola *Frenos Dulanto*, mi pedido:%0A";
    let t = 0;
    for (const n in cart) {
        msg += `• ${cart[n].qty} x ${n} - S/ ${cart[n].price * cart[n].qty}%0A`;
        t += cart[n].price * cart[n].qty;
    }
    msg += `%0ATOTAL: S/ ${t}.00`;
    window.open(`https://wa.me/51947429347?text=${msg}`, '_blank');
}

window.onclick = () => closeAllMenus();

// Inicialización
renderProductos();
