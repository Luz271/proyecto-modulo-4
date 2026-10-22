// Importamos el Storage service
import { STORAGE_KEYS, storageService } from "./StorageService.js";

// Servicio de autenticación
class AuthService {
  // Iniciar sesión
  login(email, password) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Normalizar correo (String con S mayúscula)
    const emailNormalizado = String(email).trim().toLowerCase();

    // Buscar Usuario
    const usuario = usuarios.find(
      (u) =>
        u.email.toLowerCase() === emailNormalizado &&
        u.password === password &&
        u.activo !== false,
    );

    // Credenciales incorrectas
    if (!usuario) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Crear sesión
    const sesion = {
      usuarioId: usuario.id,
      fechaInicio: new Date().toISOString(),
    };

    // Guardar sesión (pasando el objeto sesion)
    storageService.guardar(STORAGE_KEYS.SESION, sesion);

    // Devolver al usuario
    return usuario;
  }

  // Cerrar sesión
  logout() {
    storageService.eliminar(STORAGE_KEYS.SESION);
  }

  // Obtener Usuario Actual
  getCurrentUser() {
    // Recuperar sesión
    const sesion = storageService.obtener(STORAGE_KEYS.SESION, null);

    // Validar sesión
    if (!sesion) {
      return null;
    }

    // Recuperar usuarios (sin duplicar storageService)
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Buscar usuario de la sesión
    return usuarios.find((usuario) => usuario.id === sesion.usuarioId) || null;
  }
  //proteger ruta
  protegerRuta() {
    //obtener usaurio autentico
    const usuario = this.getCurrentUser();
    //Si no existe el usuario
    if (!usuario) {
      window.location.href = "index.html";

      return false;
    }
    //Acceso permitido
    return true;
  }
}

//Exportar Auth Service
export const authService = new AuthService();
