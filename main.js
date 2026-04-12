/**
 * FRENOS DULANTO - SCRIPT PRINCIPAL
 * Versión Final: Modal + Filtros + Imágenes + Carrito
 */

// --- VARIABLES GLOBALES ---
let productosData = []; // Aquí guardamos lo que viene del Excel
let cart = {};          // Aquí guardamos el pedido del usuario
let fCat = 'todas';     // Filtro de Categoría seleccionado
let fMarca = 'todas';   // Filtro de Marca seleccionado

// URL del Excel publicado como CSV
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu6I5Q2X_1DPoltNoto0K2xIoifzR-rd7WLFLv9t6szv2FiZr4gfuAybQ2rs8PFMKI92OJFNBXyANk/pub?gid=0&single=true&output=csv";

// --- 1. CARGA DE DATOS ---
async function cargarProductos() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // Dividimos por filas y quitamos la cabecera
        const filas = data.split("\n").slice(1).filter(f => f.trim() !== "");

        productosData = filas.map(linea => {
            // Regex para separar por comas sin romper lo que está entre comillas
            const columnas = linea.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            const imgBase = "https://miniture.b-cdn.net/wp-content/uploads/2023/10/kids_toys_02_1.jpeg";
            
            return {
                n: columnas[0]?.replace(/"/g, "").trim() || "Producto",      // Nombre
                m: columnas[1]?.trim().toLowerCase() || "genérico",          // Marca Auto
                c: columnas[2]?.trim().toLowerCase() || "varios",           // Categoría
                p: parseInt(columnas[3]?.trim()) || 0,                      // Precio
                brand: columnas[4]?.trim() || "",                           // Marca Repuesto
                imgs: [
                    columnas[5]?.replace(/"/g, "").trim() || imgBase,       // Foto 1
                    columnas[6]?.replace(/"/g, "").trim() || imgBase,       // Foto 2
                    columnas[7]?.replace(/"/g, "").trim() || imgBase        // Foto 3
                ],
                desc: columnas[8]?.replace(/"/g, "").trim() || "Consulte compatibilidad." // Descripción
            };
        });
        
        renderProductos(); // Dibujamos las tarjetas
    } catch (e) {
        console.error("Error cargando el catálogo:", e);
    }
}

// --- 2. RENDERIZADO DE TARJETAS ---
function renderProductos() {
    const cont = document.getElementById('contenedor');
    if (!cont) return;
    let htmlFinal = "";

    productosData.forEach((p, i) => {
        // 'data-full' guarda el texto donde el buscador va a rastrear
        htmlFinal += `
        <div class="card" data-tipo="${p.c}" data-marca="${p.m}" data-full="${p.n} ${p.m} ${p.brand}">
            <div class="img-container" onclick="openProductModal(${i})" style="cursor:pointer">
                <img src="${p.imgs[0]}" style="width:100%; height:180px; object-fit:cover; border-radius:15px 15px 0 0;">
                ${p.brand ? `<div class="brand-repuesto">${p.brand}</div>` : ""}
            </div>

            <div class="info-clickable" onclick="openProductModal(${i})" style="cursor:pointer; padding: 10px;">
                <div class="brand-tag">${p.m}</div>
                <h3 style="font-size:12px; margin:3px 0; min-height:30px;">${p.n}</h3>
                <div class="price-tag">S/ ${p.p}.00</div>
            </div>
            
            <button class="btn-add" onclick="addToCart('${p.n}', ${p.p}, event)">Añadir</button>
        </div>`;
    });
    cont.innerHTML = htmlFinal;
}

// --- 3. LÓGICA DE FILTROS ---
function ejecutarFiltro() {
    const busqueda = document.getElementById('bus').value.toLowerCase().trim();
    const palabras = busqueda.split(/\s+/);

    document.querySelectorAll('.card').forEach(card => {
        const textoCard = card.getAttribute('data-full').toLowerCase();
        const catCard = card.getAttribute('data-tipo');
        const marCard = card.getAttribute('data-marca');

        const matchCat = (fCat === 'todas' || catCard === fCat);
        const matchMar = (fMarca === 'todas' || marCard === fMarca);
        const matchBus = palabras.every(pal => textoCard.includes(pal));

        if (matchCat && matchMar && matchBus) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Cambia filtros de botones (Categoría/Marca)
function setFiltro(tipo, val, txt, el, e) {
    e.stopPropagation();
    if(tipo === 'cat') {
        fCat = val;
        document.getElementById('lCat').innerText = txt;
    } else {
        fMarca = val;
        document.getElementById('lMar').innerText = txt;
    }
    closeAllMenus();
    ejecutarFiltro();
}

// --- 4. MODAL DE PRODUCTO ---
function openProductModal(index) {
    const p = productosData[index];
    const modal = document.getElementById('productModal');
    const body = document.getElementById('modalBody');

    if (!modal || !body) return;

    body.innerHTML = `
        <img src="${p.imgs[0]}" style="width:100%; border-radius:15px; margin-bottom:15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="text-align:left;">
            <span style="color:var(--azul-premium, #0052cc); font-weight:800; font-size:11px; text-transform:uppercase;">${p.m}</span>
            <h2 style="margin:5px 0; font-size:20px; color:#1c1c1e;">${p.n}</h2>
            <div style="font-size:22px; font-weight:800; margin:10px 0; color:#333;">S/ ${p.p}.00</div>
            <div style="background:#f2f2f7; padding:15px; border-radius:12px; font-size:14px; color:#444; line-height:1.4;">
                <strong>Descripción técnica:</strong><br>${p.desc}
            </div>
            <button class="btn-add" style="width:100%; margin-top:20px; padding:18px; font-size:16px;" 
                    onclick="addToCart('${p.n}', ${p.p}, event); closeProductModal();">
                Añadir al pedido
            </button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// --- 5. CARRITO Y WHATSAPP ---
function addToCart(name, price, event) {
    event.stopPropagation();
    if (cart[name]) cart[name].qty++; 
    else cart[name] = { price, qty: 1 };
    
    updateCartUI();
    // Animación pequeña para feedback
    const btn = event.target;
    btn.innerText = "¡Añadido!";
    setTimeout(() => btn.innerText = "Añadir", 800);
}

function updateCartUI() {
    let count = 0;
    let total = 0;
    const list = document.getElementById('cartList');
    if(!list) return;

    list.innerHTML = "";
    for (const n in cart) {
        count += cart[n].qty;
        total += cart[n].price * cart[n].qty;
        list.innerHTML += `
            <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:13px;">
                <span>${cart[n].qty}x ${n}</span>
                <strong>S/ ${cart[n].price * cart[n].qty}</strong>
            </div>`;
    }
    document.getElementById('cartBadge').innerText = count;
    document.getElementById('totalLabel').innerText = "S/ " + total;
}

function sendWhatsApp() {
    let msg = "Hola Frenos Dulanto, mi pedido es:%0A";
    let total = 0;
    for (const n in cart) {
        msg += `• ${cart[n].qty} x ${n}%0A`;
        total += cart[n].price * cart[n].qty;
    }
    msg += `%0ATOTAL: S/ ${total}.00`;
    window.open(`https://wa.me/51947429347?text=${msg}`, '_blank');
}

// --- 6. UTILIDADES ---
function toggleMenu(menuId, btnId, e) {
    e.stopPropagation();
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains('show');
    closeAllMenus();
    if(!isOpen) menu.classList.add('show');
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
    const modalCart = document.getElementById('cartModal');
    if(modalCart) modalCart.style.display = 'none';
}

// Eventos de inicio
window.onclick = closeAllMenus;
document.addEventListener('DOMContentLoaded', cargarProductos);