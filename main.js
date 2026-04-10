/*
 * MAIN LOGIC - FRENOS DULANTO
 * Controla el renderizado, filtros, carrusel y carrito.
 */

let productosData = []; // Variable global para los productos
let cart = {};
let fCat = 'todas', fMarca = 'todas'; 
let touchStartX = 0;

// URL DE TU EXCEL (ASEGÚRATE QUE SEA .CSV)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu6I5Q2X_1DPoltNoto0K2xIoifzR-rd7WLFLv9t6szv2FiZr4gfuAybQ2rs8PFMKI92OJFNBXyANk/pub?gid=0&single=true&output=csv";

// 1. CARGA Y RENDERIZADO
async function cargarProductos() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        const filas = data.split("\n").slice(1); // Ignorar cabecera
        productosData = filas.map(linea => {
            const columnas = linea.split(",");
            
            // Estructura de fotos (Columnas F, G, H -> índices 5, 6, 7)
            const imgBase = "https://miniture.b-cdn.net/wp-content/uploads/2023/10/kids_toys_02_1.jpeg";
            const fotos = [
                columnas[5] && columnas[5].trim() !== "" ? columnas[5].trim() : imgBase,
                columnas[6] && columnas[6].trim() !== "" ? columnas[6].trim() : imgBase,
                columnas[7] && columnas[7].trim() !== "" ? columnas[7].trim() : imgBase
            ];

            return {
                n: columnas[0] ? columnas[0].trim() : "Producto sin nombre",
                m: columnas[1] ? columnas[1].trim().toLowerCase() : "genérico",
                c: columnas[2] ? columnas[2].trim().toLowerCase() : "varios",
                p: columnas[3] ? parseInt(columnas[3].trim()) : 0,
                brand: columnas[4] ? columnas[4].trim() : "", // Columna E: Marca del Repuesto
                imgs: fotos 
            };
        });
        renderProductos(); 
    } catch (e) {
        console.error("Error al cargar productos de Sheets:", e);
    }
}

function renderProductos() {
    const cont = document.getElementById('contenedor');
    if(!cont) return;
    
    let htmlFinal = "";
    
    productosData.forEach((p, i) => {
        const carruselHTML = `
            <img src="${p.imgs[2]}">
            <img src="${p.imgs[0]}">
            <img src="${p.imgs[1]}">
            <img src="${p.imgs[2]}">
            <img src="${p.imgs[0]}">
        `;

        // Solo mostramos la etiqueta de marca si existe en el Excel
        const labelMarca = p.brand ? `<div class="brand-repuesto">${p.brand}</div>` : "";

        htmlFinal += `
        <div class="card" data-tipo="${p.c}" data-marca="${p.m}" data-full="${p.n} ${p.m} ${p.brand}">
          <div class="carousel-container" id="container-${i}" ontouchstart="handleTouchStart(event, ${i})" ontouchend="handleTouchEnd(event, ${i})">
            
            ${labelMarca}

            <button class="carousel-btn prev" onclick="moveCarouselInfinite(${i}, -1); event.stopPropagation();">‹</button>
            <button class="carousel-btn next" onclick="moveCarouselInfinite(${i}, 1); event.stopPropagation();">›</button>

            <div class="carousel-track" id="track-${i}" data-idx="1" data-cloning="false">
              ${carruselHTML}
            </div>
            <div class="carousel-indicators">
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="brand-tag">${p.m}</div>
          <h3 style="font-size:12px; margin:3px 0; min-height:30px;">${p.n}</h3>
          <div class="price-tag">S/ ${p.p}.00</div>
          <button class="btn-add" onclick="addToCart('${p.n}', ${p.p}, event)">Añadir</button>
        </div>`;
    });
    cont.innerHTML = htmlFinal;
}

// ... (Resto de funciones: Lógica del carrusel, Filtros, Carrito y Utilidades se mantienen exactamente igual)

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
    let indicatorIdx = (nextIdx === 4) ? 0 : (nextIdx === 0) ? 2 : nextIdx - 1;
    indicators.forEach(i => i.classList.remove('active'));
    if(indicators[indicatorIdx]) indicators[indicatorIdx].classList.add('active');
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
    if(tipo === 'cat') { fCat = val; document.getElementById('lCat').innerText = txt; document.getElementById('btnCat').classList.toggle('active-filter', val !== 'todas'); }
    else { fMarca = val; document.getElementById('lMar').innerText = txt; document.getElementById('btnMar').classList.toggle('active-filter', val !== 'todas'); }
    const menuId = (tipo === 'cat' ? 'mCat' : 'mMar');
    document.querySelectorAll(`#${menuId} .menu-item`).forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    closeAllMenus();
    ejecutarFiltro();
}

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
    const badge = document.getElementById('cartBadge');
    if(badge) badge.innerText = count;
    const totalLab = document.getElementById('totalLabel');
    if(totalLab) totalLab.innerText = `S/ ${total}`;
}

function changeQty(name, delta, e) {
    e.stopPropagation();
    cart[name].qty += delta;
    if (cart[name].qty <= 0) delete cart[name];
    updateCartUI();
}

function animateFlyer(event) {
    const btnCart = document.getElementById('btnCart');
    if(!btnCart) return;
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
    setTimeout(() => { flyer.remove(); btnCart.style.transform = 'scale(1.3)'; setTimeout(() => btnCart.style.transform = 'scale(1)', 200); }, 700);
}

function toggleMenu(menuId, btnId, e) {
    e.stopPropagation();
    const menu = document.getElementById(menuId);
    const isShowing = menu.classList.contains('show');
    closeAllMenus();
    if(!isShowing) { menu.classList.add('show'); document.getElementById(btnId).classList.add('open'); }
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
    const modal = document.getElementById('cartModal');
    if(modal) modal.style.display = 'none';
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
// CONFIGURACIÓN DE ARRANQUE
window.addEventListener('load', () => {
    // 1. Empezamos a cargar los productos de Google Sheets de inmediato
    cargarProductos();

    const pantalla = document.getElementById('pantalla-carga');

    // 2. Control de la pantalla de inicio (Splash Screen)
    setTimeout(() => {
        if (pantalla) {
            pantalla.style.opacity = '0';

            setTimeout(() => {
                pantalla.style.display = 'none';
                
                // 3. Liberamos el scroll para que el cliente pueda bajar
                document.body.style.overflow = 'visible';
                document.documentElement.style.overflow = 'visible';
                
                console.log("Catálogo listo y scroll liberado");
            }, 500);
        }
    }, 2500); // Le damos 2.5 segundos para que se vea bien tu marca
});
