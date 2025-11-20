// Inicializar mapa y simulación de viaje
let mapa;
let marcadorVehiculo;
let rutaPolyline;
let viajeActual;
let estadoViaje = 0;
let intervalSimulacion;
let posicionActual = 0;
let rutaPuntos = [];

// Estados del viaje
const ESTADOS = {
    SOLICITADO: 0,
    CONFIRMADO: 1,
    EN_CAMINO: 2,
    CARGANDO: 3,
    EN_TRANSITO: 4,
    COMPLETADO: 5
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos del viaje
    const datosViaje = localStorage.getItem('viajeActual');
    
    if (!datosViaje) {
        alert('No hay viaje activo');
        window.location.href = 'index.html';
        return;
    }
    
    viajeActual = JSON.parse(datosViaje);
    
    // Cargar información del conductor
    document.getElementById('conductor-foto').src = viajeActual.transportista.foto;
    document.getElementById('conductor-nombre').textContent = viajeActual.transportista.nombre;
    document.getElementById('conductor-vehiculo').textContent = viajeActual.transportista.vehiculo;
    
    // Cargar información del viaje
    document.getElementById('info-origen').textContent = viajeActual.origen;
    document.getElementById('info-destino').textContent = viajeActual.destino;
    document.getElementById('info-carga').textContent = viajeActual.descripcion;
    
    // Inicializar mapa
    inicializarMapa();
    
    // Iniciar simulación
    setTimeout(() => {
        iniciarSimulacion();
    }, 1000);
});

// Inicializar el mapa de Leaflet
function inicializarMapa() {
    // Usar coordenadas reales del viaje
    const origenCoord = viajeActual.coordOrigen;
    const destinoCoord = viajeActual.coordDestino;
    
    // Centro del mapa entre origen y destino
    const centroLat = (origenCoord[0] + destinoCoord[0]) / 2;
    const centroLon = (origenCoord[1] + destinoCoord[1]) / 2;
    
    // Crear mapa
    mapa = L.map('mapa').setView([centroLat, centroLon], 12);
    
    // Agregar capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mapa);
    
    // Crear ícono personalizado para el vehículo
    const iconoVehiculo = L.divIcon({
        className: 'vehiculo-marker',
        html: '<div style="font-size: 35px; text-align: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🚚</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Marcadores de origen y destino
    L.marker(origenCoord, {
        icon: L.divIcon({
            className: 'marker-origen',
            html: '<div style="background: #10b981; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">A</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    }).addTo(mapa).bindPopup('📍 Origen: ' + viajeActual.origen);
    
    L.marker(destinoCoord, {
        icon: L.divIcon({
            className: 'marker-destino',
            html: '<div style="background: #ef4444; color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">B</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    }).addTo(mapa).bindPopup('📍 Destino: ' + viajeActual.destino);
    
    // Posición inicial del transportista (cerca del origen)
    const posicionInicial = obtenerCoordenadas(viajeActual.transportista.zona);
    
    // Crear marcador del vehículo
    marcadorVehiculo = L.marker(posicionInicial, { icon: iconoVehiculo }).addTo(mapa);
    
    // Obtener ruta real usando OSRM
    obtenerRutaReal(posicionInicial, origenCoord, destinoCoord);
}

// Obtener ruta real usando OSRM (Open Source Routing Machine)
async function obtenerRutaReal(posicionInicial, origen, destino) {
    try {
        // Ruta 1: Del conductor al origen
        const ruta1 = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${posicionInicial[1]},${posicionInicial[0]};${origen[1]},${origen[0]}?overview=full&geometries=geojson`
        );
        const data1 = await ruta1.json();
        
        // Ruta 2: Del origen al destino
        const ruta2 = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origen[1]},${origen[0]};${destino[1]},${destino[0]}?overview=full&geometries=geojson`
        );
        const data2 = await ruta2.json();
        
        if (data1.routes && data1.routes[0] && data2.routes && data2.routes[0]) {
            // Combinar las dos rutas
            const coordsRuta1 = data1.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            const coordsRuta2 = data2.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            
            rutaPuntos = [...coordsRuta1, ...coordsRuta2];
            
            // Dibujar ruta en el mapa
            rutaPolyline = L.polyline(rutaPuntos, {
                color: '#2563eb',
                weight: 5,
                opacity: 0.7
            }).addTo(mapa);
            
            // Ajustar vista para mostrar toda la ruta
            mapa.fitBounds(rutaPolyline.getBounds(), { padding: [50, 50] });
            
            // Calcular distancia y tiempo real
            const distanciaTotal = (data1.routes[0].distance + data2.routes[0].distance) / 1000; // en km
            const tiempoTotal = Math.round((data1.routes[0].duration + data2.routes[0].duration) / 60); // en minutos
            
            console.log(`Distancia real: ${distanciaTotal.toFixed(1)} km`);
            console.log(`Tiempo estimado: ${tiempoTotal} minutos`);
        } else {
            // Fallback: usar ruta simulada si OSRM falla
            console.log('Usando ruta simulada (OSRM no disponible)');
            generarRutaSimulada(posicionInicial, origen, destino);
        }
    } catch (error) {
        console.error('Error al obtener ruta:', error);
        // Fallback: generar ruta simulada
        generarRutaSimulada(posicionInicial, origen, destino);
    }
}

// Generar ruta simulada entre puntos (fallback)
function generarRutaSimulada(inicio, origen, destino) {
    rutaPuntos = [];
    
    // Fase 1: Del conductor al origen (20 puntos)
    const puntosAOrigen = interpolarPuntos(inicio, origen, 20);
    rutaPuntos.push(...puntosAOrigen);
    
    // Fase 2: Del origen al destino (40 puntos)
    const puntosADestino = interpolarPuntos(origen, destino, 40);
    rutaPuntos.push(...puntosADestino);
    
    // Dibujar ruta
    rutaPolyline = L.polyline(rutaPuntos, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.7
    }).addTo(mapa);
    
    // Ajustar vista
    mapa.fitBounds(rutaPolyline.getBounds(), { padding: [50, 50] });
}

// Interpolar puntos entre dos coordenadas con variación para simular calles
function interpolarPuntos(inicio, fin, numPuntos) {
    const puntos = [];
    for (let i = 0; i <= numPuntos; i++) {
        const t = i / numPuntos;
        
        // Agregar curvas suaves usando funciones seno
        const curvaFactor = Math.sin(t * Math.PI) * 0.001;
        
        const lat = inicio[0] + (fin[0] - inicio[0]) * t + curvaFactor;
        const lng = inicio[1] + (fin[1] - inicio[1]) * t + curvaFactor * 1.5;
        
        puntos.push([lat, lng]);
    }
    return puntos;
}

// Iniciar simulación del viaje
function iniciarSimulacion() {
    estadoViaje = ESTADOS.SOLICITADO;
    actualizarEstadoVisual();
    
    // Secuencia de estados
    setTimeout(() => cambiarEstado(ESTADOS.CONFIRMADO), 2000);
    setTimeout(() => cambiarEstado(ESTADOS.EN_CAMINO), 4000);
    setTimeout(() => iniciarMovimiento(), 5000);
}

// Cambiar estado del viaje
function cambiarEstado(nuevoEstado) {
    estadoViaje = nuevoEstado;
    actualizarEstadoVisual();
    
    const mensajes = {
        [ESTADOS.SOLICITADO]: {
            titulo: 'Solicitando viaje...',
            detalle: 'Buscando el mejor transportista para ti'
        },
        [ESTADOS.CONFIRMADO]: {
            titulo: '✓ Viaje confirmado',
            detalle: `${viajeActual.transportista.nombre} aceptó tu solicitud`
        },
        [ESTADOS.EN_CAMINO]: {
            titulo: '🚗 En camino al origen',
            detalle: 'El transportista se dirige a recoger tu carga'
        },
        [ESTADOS.CARGANDO]: {
            titulo: '📦 Cargando mercancía',
            detalle: 'Cargando en el punto de origen'
        },
        [ESTADOS.EN_TRANSITO]: {
            titulo: '🚚 En tránsito al destino',
            detalle: 'Tu carga está en camino al destino'
        },
        [ESTADOS.COMPLETADO]: {
            titulo: '🎉 Viaje completado',
            detalle: 'Tu carga ha llegado al destino exitosamente'
        }
    };
    
    const msg = mensajes[nuevoEstado];
    document.getElementById('estado-actual').textContent = msg.titulo;
    document.getElementById('estado-detalle').textContent = msg.detalle;
}

// Actualizar visualización de pasos
function actualizarEstadoVisual() {
    // Limpiar todos
    for (let i = 1; i <= 6; i++) {
        const paso = document.getElementById(`paso-${i}`);
        paso.classList.remove('activo', 'completado');
    }
    
    // Marcar completados
    for (let i = 1; i <= estadoViaje; i++) {
        document.getElementById(`paso-${i}`).classList.add('completado');
    }
    
    // Marcar activo
    if (estadoViaje < 6) {
        document.getElementById(`paso-${estadoViaje + 1}`).classList.add('activo');
    }
}

// Iniciar movimiento del vehículo
function iniciarMovimiento() {
    if (rutaPuntos.length === 0) {
        console.error('No hay ruta disponible');
        return;
    }
    
    posicionActual = 0;
    
    // Calcular punto donde se considera que llegó al origen (30% de la ruta)
    const puntoOrigen = Math.floor(rutaPuntos.length * 0.3);
    
    intervalSimulacion = setInterval(() => {
        if (posicionActual < rutaPuntos.length - 1) {
            posicionActual++;
            const nuevaPos = rutaPuntos[posicionActual];
            
            // Mover marcador con animación suave
            marcadorVehiculo.setLatLng(nuevaPos);
            
            // Centrar mapa en el vehículo cada cierto tiempo
            if (posicionActual % 10 === 0) {
                mapa.panTo(nuevaPos, { animate: true, duration: 0.5 });
            }
            
            // Calcular progreso
            const progreso = posicionActual / rutaPuntos.length;
            
            // Cambiar estados según progreso
            if (posicionActual === puntoOrigen && estadoViaje === ESTADOS.EN_CAMINO) {
                cambiarEstado(ESTADOS.CARGANDO);
                // Pausar 3 segundos en el origen
                clearInterval(intervalSimulacion);
                setTimeout(() => {
                    cambiarEstado(ESTADOS.EN_TRANSITO);
                    intervalSimulacion = setInterval(continuarMovimiento, 150);
                }, 3000);
            }
            
            if (progreso >= 0.98 && estadoViaje === ESTADOS.EN_TRANSITO) {
                cambiarEstado(ESTADOS.COMPLETADO);
                clearInterval(intervalSimulacion);
                setTimeout(() => mostrarModalCompletado(), 2000);
            }
            
            // Actualizar tiempos estimados
            actualizarTiempos(progreso, puntoOrigen);
        }
    }, 150); // Velocidad de animación más suave
}

function continuarMovimiento() {
    if (posicionActual < rutaPuntos.length - 1) {
        posicionActual++;
        const nuevaPos = rutaPuntos[posicionActual];
        marcadorVehiculo.setLatLng(nuevaPos);
        
        if (posicionActual % 10 === 0) {
            mapa.panTo(nuevaPos, { animate: true, duration: 0.5 });
        }
        
        const progreso = posicionActual / rutaPuntos.length;
        actualizarTiempos(progreso, Math.floor(rutaPuntos.length * 0.3));
        
        if (progreso >= 0.98) {
            cambiarEstado(ESTADOS.COMPLETADO);
            clearInterval(intervalSimulacion);
            setTimeout(() => mostrarModalCompletado(), 2000);
        }
    }
}

// Actualizar tiempos estimados
function actualizarTiempos(progreso, puntoOrigen) {
    const tiempoOrigen = document.getElementById('tiempo-origen');
    const tiempoDestino = document.getElementById('tiempo-destino');
    
    const progresoOrigen = posicionActual / puntoOrigen;
    const progresoDestino = (posicionActual - puntoOrigen) / (rutaPuntos.length - puntoOrigen);
    
    if (tiempoOrigen && progreso < 0.3) {
        const mins = Math.max(1, Math.round((1 - progresoOrigen) * 8));
        tiempoOrigen.textContent = `${mins} min`;
    }
    
    if (tiempoDestino && progreso >= 0.3) {
        const mins = Math.max(1, Math.round((1 - progresoDestino) * 15));
        tiempoDestino.textContent = `${mins} min`;
    }
}

// Mostrar modal de viaje completado
function mostrarModalCompletado() {
    const modal = document.getElementById('modal-completado');
    modal.style.display = 'flex';
    
    // Rating stars
    const stars = document.querySelectorAll('.star');
    let ratingSeleccionado = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            ratingSeleccionado = parseInt(this.dataset.rating);
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= ratingSeleccionado) {
                    s.classList.add('selected');
                    s.textContent = '⭐';
                } else {
                    s.classList.remove('selected');
                    s.textContent = '☆';
                }
            });
        });
    });
}

// Finalizar viaje
function finalizarViaje() {
    const comentario = document.getElementById('comentario-viaje').value;
    const rating = document.querySelectorAll('.star.selected').length;
    
    if (rating === 0) {
        alert('Por favor califica el servicio');
        return;
    }
    
    // Guardar calificación
    console.log('Viaje finalizado:', {
        transportista: viajeActual.transportista.nombre,
        rating: rating,
        comentario: comentario,
        origen: viajeActual.origen,
        destino: viajeActual.destino
    });
    
    alert(`¡Gracias por tu calificación! 🎉\n\nHas calificado a ${viajeActual.transportista.nombre} con ${rating} estrellas.`);
    
    // Limpiar y volver al inicio
    localStorage.removeItem('viajeActual');
    window.location.href = 'index.html';
}