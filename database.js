// URL base para las imágenes
const imgUrlBase = "https://miniture.b-cdn.net/wp-content/uploads/2023/10/kids_toys_02_1.jpeg";

// Lista de productos: c=categoría, m=marca, n=nombre, p=precio


const productosData = [
    {
        c: "pastilla",
        m: "toyota",
        n: "Pastilla Hilux Revo",
        p: 120,
        d: "Pastillas de freno de alto rendimiento, mayor durabilidad y mejor frenado.",
        code: "TOY-PH-001",
        imgs: [
            "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2",
            "https://images.unsplash.com/photo-1583267746897-2cf415887172",
            "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e"
        ]
    },
    {
        c: "disco",
        m: "nissan",
        n: "Disco Frontier Delantero",
        p: 180,
        d: "Disco ventilado para mejor disipación de calor y rendimiento constante.",
        code: "NIS-DI-002",
        imgs: [
            "https://images.unsplash.com/photo-1625047509248-ec889cbff17f",
            "https://images.unsplash.com/photo-1597764690523-15bea4c581c9"
        ]
    },
    {
        c: "amortiguador",
        m: "toyota",
        n: "Amortiguador Hilux",
        p: 250,
        d: "Amortiguador reforzado ideal para terrenos exigentes.",
        code: "TOY-AM-003",
        imgs: [
            "https://images.unsplash.com/photo-1615906655593-ad0386982a0f",
            "https://images.unsplash.com/photo-1593941707882-a56bbc8dfc58"
        ]
    },
    {
        c: "radiador",
        m: "hyundai",
        n: "Radiador Accent",
        p: 420,
        d: "Radiador de alta eficiencia para mantener la temperatura ideal del motor.",
        code: "HYU-RA-004",
        imgs: [
            "https://images.unsplash.com/photo-1581091870622-1e7c1e9b4c85",
            "https://images.unsplash.com/photo-1604147706283-6c1a4e8d3d11"
        ]
    },
    {
        c: "zapata",
        m: "toyota",
        n: "Zapata Hilux",
        p: 130,
        d: "Zapata de freno resistente con excelente agarre.",
        code: "TOY-ZA-005",
        imgs: [
            "https://images.unsplash.com/photo-1616627451515-cbc80e5a3a8b",
            "https://images.unsplash.com/photo-1606577924006-27d39b132ae2"
        ]
    },
    {
        c: "embrague",
        m: "nissan",
        n: "Kit Embrague NP300",
        p: 850,
        d: "Kit completo de embrague para máximo rendimiento y durabilidad.",
        code: "NIS-EM-006",
        imgs: [
            "https://images.unsplash.com/photo-1625047509475-4c0d3f78eaef",
            "https://images.unsplash.com/photo-1597007030739-6d2e6d5d6f41"
        ]
    }
];

// Relleno automático para pruebas (hasta 20 items)
while(productosData.length < 20) {
    let base = productosData[Math.floor(Math.random() * productosData.length)];
    productosData.push({...base, n: base.n + " " + productosData.length});
}
