// Base de datos de transportistas
const transportistas = [
    {
        id: 1,
        nombre: "Carlos Martínez",
        foto: "https://i.pravatar.cc/150?img=12",
        vehiculo: "Pickup",
        zona: "Centro",
        rating: 4.8,
        viajes: 156,
        disponible: true,
        capacidad: "1.5 toneladas",
        zonasServicio: ["Centro", "Choloma", "Zona Norte"],
        descripcion: "Transportista con más de 5 años de experiencia. Especializado en mudanzas residenciales y traslado de muebles. Vehículo en excelente estado.",
        comentarios: [
            {
                usuario: "María López",
                rating: 5,
                texto: "Excelente servicio, muy puntual y cuidadoso con los muebles. Lo recomiendo 100%.",
                fecha: "Hace 2 días"
            },
            {
                usuario: "Jorge Reyes",
                rating: 5,
                texto: "Muy profesional, llegó a tiempo y me ayudó a cargar todo. Buen precio.",
                fecha: "Hace 1 semana"
            },
            {
                usuario: "Ana García",
                rating: 4,
                texto: "Buen servicio, aunque llegó 10 minutos tarde. Pero el trabajo fue excelente.",
                fecha: "Hace 2 semanas"
            }
        ]
    },
    {
        id: 2,
        nombre: "Roberto Sánchez",
        foto: "https://i.pravatar.cc/150?img=33",
        vehiculo: "Panel",
        zona: "Choloma",
        rating: 4.9,
        viajes: 203,
        disponible: true,
        capacidad: "1 tonelada",
        zonasServicio: ["Choloma", "Centro", "Rivera Hernández"],
        descripcion: "Panel cerrado ideal para proteger tu mercancía. Servicio rápido y confiable para comercios y hogares.",
        comentarios: [
            {
                usuario: "Tienda El Ahorro",
                rating: 5,
                texto: "Trabajamos con Roberto desde hace meses. Siempre puntual y responsable.",
                fecha: "Hace 3 días"
            },
            {
                usuario: "Luis Fernández",
                rating: 5,
                texto: "Excelente atención y cuidado con la mercancía. Muy recomendado.",
                fecha: "Hace 5 días"
            }
        ]
    },
    {
        id: 3,
        nombre: "Miguel Ángel Torres",
        foto: "https://i.pravatar.cc/150?img=51",
        vehiculo: "Camión",
        zona: "Zona Norte",
        rating: 4.7,
        viajes: 89,
        disponible: true,
        capacidad: "3.5 toneladas",
        zonasServicio: ["Zona Norte", "Zona Este", "Centro", "Choloma"],
        descripcion: "Camión de 3.5 toneladas para cargas grandes. Ideal para empresas y mudanzas completas. Incluye ayudantes.",
        comentarios: [
            {
                usuario: "Constructora López",
                rating: 5,
                texto: "Perfecto para transportar materiales de construcción. Muy formal.",
                fecha: "Hace 1 día"
            },
            {
                usuario: "Pedro Hernández",
                rating: 4,
                texto: "Buen servicio, vehículo amplio. Solo un poco más caro pero vale la pena.",
                fecha: "Hace 1 semana"
            }
        ]
    },
    {
        id: 4,
        nombre: "José Luis Mejía",
        foto: "https://i.pravatar.cc/150?img=68",
        vehiculo: "Pickup",
        zona: "Zona Este",
        rating: 4.6,
        viajes: 124,
        disponible: true,
        capacidad: "1.5 toneladas",
        zonasServicio: ["Zona Este", "Centro", "Zona Sur"],
        descripcion: "Servicio de flete rápido y económico. Disponible los 7 días de la semana.",
        comentarios: [
            {
                usuario: "Carmen Rodríguez",
                rating: 5,
                texto: "Muy amable y servicial. Me ayudó incluso a subir las cajas al apartamento.",
                fecha: "Hace 4 días"
            },
            {
                usuario: "Ricardo Paz",
                rating: 4,
                texto: "Buen servicio, precio justo.",
                fecha: "Hace 10 días"
            }
        ]
    },
    {
        id: 5,
        nombre: "Fernando Castillo",
        foto: "https://i.pravatar.cc/150?img=15",
        vehiculo: "Panel",
        zona: "Centro",
        rating: 4.9,
        viajes: 187,
        disponible: true,
        capacidad: "1.2 toneladas",
        zonasServicio: ["Centro", "Zona Norte", "Zona Este"],
        descripcion: "Panel refrigerado disponible. Especializado en productos delicados y mercancía que requiere cuidado especial.",
        comentarios: [
            {
                usuario: "Farmacia San José",
                rating: 5,
                texto: "Perfecto para transportar productos sensibles. Muy profesional.",
                fecha: "Hace 2 días"
            },
            {
                usuario: "Claudia Mejía",
                rating: 5,
                texto: "Impecable servicio, muy cuidadoso con todo.",
                fecha: "Hace 1 semana"
            }
        ]
    },
    {
        id: 6,
        nombre: "David Ramírez",
        foto: "https://i.pravatar.cc/150?img=56",
        vehiculo: "Motocicleta",
        zona: "Rivera Hernández",
        rating: 4.5,
        viajes: 312,
        disponible: true,
        capacidad: "50 kg",
        zonasServicio: ["Rivera Hernández", "Centro", "Choloma"],
        descripcion: "Servicio express para paquetes pequeños y encargos urgentes. El más rápido de la zona.",
        comentarios: [
            {
                usuario: "Elena Vargas",
                rating: 5,
                texto: "Super rápido! Perfecto para envíos urgentes.",
                fecha: "Hace 1 día"
            },
            {
                usuario: "Tienda La Económica",
                rating: 4,
                texto: "Lo usamos para entregas a domicilio. Muy ágil.",
                fecha: "Hace 3 días"
            }
        ]
    },
    {
        id: 7,
        nombre: "Andrés Gómez",
        foto: "https://i.pravatar.cc/150?img=70",
        vehiculo: "Pickup",
        zona: "Zona Sur",
        rating: 4.8,
        viajes: 145,
        disponible: true,
        capacidad: "1.5 toneladas",
        zonasServicio: ["Zona Sur", "Centro", "Zona Este"],
        descripcion: "Pickup 4x4 para acceder a zonas difíciles. Servicio confiable y seguro.",
        comentarios: [
            {
                usuario: "Marcos Silva",
                rating: 5,
                texto: "Llegó a una zona complicada sin problemas. Muy recomendado.",
                fecha: "Hace 5 días"
            },
            {
                usuario: "Patricia Núñez",
                rating: 5,
                texto: "Excelente servicio y muy amable.",
                fecha: "Hace 2 semanas"
            }
        ]
    },
    {
        id: 8,
        nombre: "Oscar Pineda",
        foto: "https://i.pravatar.cc/150?img=13",
        vehiculo: "Camión",
        zona: "Choloma",
        rating: 4.7,
        viajes: 98,
        disponible: true,
        capacidad: "3.5 toneladas",
        zonasServicio: ["Choloma", "Centro", "Zona Norte", "Zona Este"],
        descripcion: "Camión con rampa hidráulica. Ideal para maquinaria pesada y cargas grandes.",
        comentarios: [
            {
                usuario: "Industrial Pérez",
                rating: 5,
                texto: "Perfecto para mover maquinaria. Muy profesionales.",
                fecha: "Hace 3 días"
            },
            {
                usuario: "Alberto Cruz",
                rating: 4,
                texto: "Buen equipo, llegaron con ayudantes.",
                fecha: "Hace 1 semana"
            }
        ]
    }
];

// Coordenadas de San Pedro Sula y zonas
const coordenadas = {
    centro: [15.5050, -88.0250],
    choloma: [15.6100, -87.9550],
    zonaNorte: [15.5300, -88.0100],
    zonaEste: [15.4950, -87.9900],
    zonaSur: [15.4700, -88.0300],
    riveraHernandez: [15.4850, -88.0450]
};

// Función para obtener coordenadas por zona
function obtenerCoordenadas(zona) {
    const mapaZonas = {
        "Centro": coordenadas.centro,
        "Choloma": coordenadas.choloma,
        "Zona Norte": coordenadas.zonaNorte,
        "Zona Este": coordenadas.zonaEste,
        "Zona Sur": coordenadas.zonaSur,
        "Rivera Hernández": coordenadas.riveraHernandez
    };
    return mapaZonas[zona] || coordenadas.centro;
}