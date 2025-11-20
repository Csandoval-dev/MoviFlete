// Sistema de Autenticación Simplificado - Fletes HN
const Auth = {
    // Credenciales fijas
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'admin',
    SESSION_KEY: 'fleteshn_sesion',

    // Iniciar sesión (solo admin)
    login(username, password) {
        if (username === this.ADMIN_USER && password === this.ADMIN_PASS) {
            const sesion = {
                usuario: 'admin',
                nombre: 'Administrador',
                tipo: 'usuario',
                fechaLogin: new Date().toISOString()
            };
            
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sesion));
            
            return {
                success: true,
                message: 'Inicio de sesión exitoso'
            };
        } else {
            return {
                success: false,
                message: 'Usuario o contraseña incorrectos'
            };
        }
    },

    // Cerrar sesión
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'landing.html';
    },

    // Obtener usuario actual
    obtenerUsuarioActual() {
        const sesion = localStorage.getItem(this.SESSION_KEY);
        return sesion ? JSON.parse(sesion) : null;
    },

    // Verificar si hay sesión activa
    estaAutenticado() {
        return this.obtenerUsuarioActual() !== null;
    },

    // Proteger página (requiere autenticación)
    protegerPagina() {
        if (!this.estaAutenticado()) {
            alert('Debes iniciar sesión para acceder a esta página');
            window.location.href = 'login.html';
        }
    }
};

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}