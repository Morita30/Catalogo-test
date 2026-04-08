const imgUrlBase = "https://miniture.b-cdn.net/wp-content/uploads/2023/10/kids_toys_02_1.jpeg";

const productosData = [
    { 
        id: 1,
        c: "pastilla", m: "toyota", n: "Pastilla Hilux Revo", p: 120,
        oem: "04465-0K290",
        compatibilidad: "Toyota Hilux (2016-2024), Fortuner",
        medidas: "L: 145mm | A: 55mm | E: 17.5mm",
        descripcion: "Pastillas semimetálicas de alta fricción. Soporta altas temperaturas.",
        incluye: "Juego de 4 pastillas (eje delantero)",
        stock: "Disponible"
    },
    { 
        id: 2,
        c: "disco", m: "nissan", n: "Disco Frontier Del", p: 180,
        oem: "40206-EB300",
        compatibilidad: "Nissan Frontier NP300 (2015-2023)",
        medidas: "D: 296mm | E: 28mm | H: 44mm",
        descripcion: "Disco ventilado con tratamiento anticorrosivo de alta duración.",
        incluye: "1 Disco de freno ventilado",
        stock: "Disponible"
    }
];

// Esto rellena el catálogo para las pruebas
while(productosData.length < 54) {
    let base = productosData[Math.floor(Math.random() * productosData.length)];
    productosData.push({...base, id: productosData.length + 1, n: base.n + " " + productosData.length});
}
