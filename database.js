// BASE DE DATOS DE PRODUCTOS - FRENOS DULANTO
const imgUrlBase = "https://miniture.b-cdn.net/wp-content/uploads/2023/10/kids_toys_02_1.jpeg";

const productosData = [
    { c: "pastilla", m: "toyota", n: "Pastilla Hilux Revo", p: 120, e: "m" },
    { c: "disco", m: "nissan", n: "Disco Frontier Del", p: 180, e: "o" },
    { c: "amortiguador", m: "toyota", n: "Amortiguador Hilux", p: 250 },
    { c: "radiador", m: "hyundai", n: "Radiador Accent", p: 420, e: "o" },
    { c: "zapata", m: "toyota", n: "Zapata Hilux", p: 130 },
    { c: "embrague", m: "nissan", n: "Kit Embrague NP300", p: 850, e: "m" }
];

while(productosData.length < 54) {
    let base = productosData[Math.floor(Math.random() * productosData.length)];
    productosData.push({...base, n: base.n + " " + productosData.length});
}
