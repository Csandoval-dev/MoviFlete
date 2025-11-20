// Variables globales
let ubicacionUsuario = null;
let transportistasConDistancia = [];

// Cargar transportistas al inicio
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('lista-transportistas')) {
        // Intentar obtener ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    ubicacionUsuario = [position.coords.latitude, position.coords.longitude];
                    console.log('Ubicación del usuario obtenida:', ubicacionUsuario);
                    calcularDistancias();
                    mostrarTransportistas(transportistasConDistancia);
                },
                (error) => {
                    console.log('No se pudo obtener ubicación:', error.message);
                    // Mostrar sin distancias
                    transportistasConDistancia = transportistas.map(t => ({...t, distancia: null}));
                    mostrarTransportistas(transportistasConDistancia);
                }
            );
        } else {
            // Navegador no soporta geolocalización
            transportistasConDistancia = transportistas.map(t => ({...t, distancia: null}));
            mostrarTransportistas(transportistasConDistancia);
        }
    }
});

// Calcular distancias a todos los transportistas
function calcularDistancias() {
    if (!ubicacionUsuario) return;
    
    transportistasConDistancia = transportistas.map(t => {
        const coordTransportista = obtenerCoordenadas(t.zona);
        const distancia = calcularDistancia(ubicacionUsuario, coordTransportista);
        return { ...t, distancia: distancia };
    });
    
    // Ordenar por distancia
    transportistasConDistancia.sort((a, b) => a.distancia - b.distancia);
}

// Calcular distancia entre dos coordenadas (fórmula de Haversine)
function calcularDistancia(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coord1[0] * Math.PI / 180) * 
            Math.cos(coord2[0] * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Mostrar transportistas en el grid
function mostrarTransportistas(lista) {
    const container = document.getElementById('lista-transportistas');
    const contador = document.getElementById('contador');
    
    if (!container) return;
    
    contador.textContent = `(${lista.length})`;
    
    if (lista.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3 style="color: var(--text-light);">😕 No se encontraron transportistas</h3>
                <p>Intenta con otros filtros</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = lista.map(t => {
        // Tag de distancia si está disponible
        let distanciaTag = '';
        if (t.distancia !== null && t.distancia !== undefined) {
            const color = t.distancia < 3 ? '#dcfce7' : t.distancia < 7 ? '#fef3c7' : '#fee2e2';
            const textColor = t.distancia < 3 ? '#166534' : t.distancia < 7 ? '#92400e' : '#991b1b';
            distanciaTag = `<span class="tag" style="background: ${color}; color: ${textColor}; font-weight: 600;">📍 ${t.distancia.toFixed(1)} km</span>`;
        }
        
        return `
            <div class="card-transportista" onclick="verPerfil(${t.id})">
                <div class="card-header">
                    <img src="${t.foto}" alt="${t.nombre}" class="foto-perfil">
                    <div class="card-info">
                        <h3>${t.nombre}</h3>
                        <div class="rating">
                            <span class="estrellas">${generarEstrellas(t.rating)}</span>
                            <span>${t.rating} (${t.viajes} viajes)</span>
                        </div>
                        <div class="tags">
                            <span class="tag">📍 ${t.zona}</span>
                            <span class="tag">🚗 ${t.vehiculo}</span>
                            ${distanciaTag}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    ${t.disponible ? '<span class="disponibilidad">✓ Disponible ahora</span>' : ''}
                    <p>${t.descripcion.substring(0, 100)}...</p>
                    <button class="btn-primary" onclick="event.stopPropagation(); verPerfil(${t.id})">
                        Ver perfil completo
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Generar estrellas para rating
function generarEstrellas(rating) {
    let estrellas = '';
    for(let i = 1; i <= 5; i++) {
        estrellas += i <= Math.floor(rating) ? '⭐' : '☆';
    }
    return estrellas;
}

// Filtrar transportistas
function filtrarTransportistas() {
    const zona = document.getElementById('zona').value;
    const vehiculo = document.getElementById('vehiculo').value;
    
    let filtrados = transportistasConDistancia.length > 0 ? 
                    transportistasConDistancia : 
                    transportistas.map(t => ({...t, distancia: null}));
    
    if (zona) {
        filtrados = filtrados.filter(t => 
            t.zona === zona || t.zonasServicio.includes(zona)
        );
    }
    
    if (vehiculo) {
        filtrados = filtrados.filter(t => t.vehiculo === vehiculo);
    }
    
    // Si hay ubicación, ordenar por distancia
    if (ubicacionUsuario && filtrados.length > 0 && filtrados[0].distancia !== null) {
        filtrados.sort((a, b) => a.distancia - b.distancia);
    }
    
    mostrarTransportistas(filtrados);
    
    // Scroll suave a resultados
    document.querySelector('.resultados').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Ver perfil de transportista
function verPerfil(id) {
    window.location.href = `perfil.html?id=${id}`;
}

// Agregar listener para los filtros
document.addEventListener('DOMContentLoaded', function() {
    const zona = document.getElementById('zona');
    const vehiculo = document.getElementById('vehiculo');
    
    if (zona) {
        zona.addEventListener('change', filtrarTransportistas);
    }
    if (vehiculo) {
        vehiculo.addEventListener('change', filtrarTransportistas);
    }
});