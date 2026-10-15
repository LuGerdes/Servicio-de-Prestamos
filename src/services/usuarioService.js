// src/services/UsuarioService.js
const Usuario = require('../models/usuario');

class usuarioService {
  /**
   * Inicializa el servicio con un listado opcional de usuarios.
   * @param {Array<Usuario>} usuariosIniciales 
   */
  constructor(usuariosIniciales = []) {
    this.usuarios = [...usuariosIniciales];
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param {Usuario} nuevoUsuario 
   */
  registrarUsuario(nuevoUsuario) {
    if (!nuevoUsuario || !nuevoUsuario.id) {
      throw new Error('Datos de usuario inválidos.');
    }

    const existe = this.usuarios.some(u => u.id === nuevoUsuario.id);
    if (existe) {
      throw new Error(`Ya existe un usuario registrado con el ID ${nuevoUsuario.id}.`);
    }

    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  /**
   * Busca un usuario por su identificador.
   * @param {number|string} id 
   */
  buscarPorId(id) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado.`);
    }
    return usuario;
  }

  /**
   * Lista todos los usuarios registrados.
   * Regla de negocio: Exclusivo para administradores.
   * @param {Usuario} usuarioEjecutor 
   */
  listarUsuarios(usuarioEjecutor) {
    if (!usuarioEjecutor || !usuarioEjecutor.esAdmin()) {
      throw new Error('Acceso denegado: solo un administrador puede consultar el padrón de usuarios.');
    }
    return [...this.usuarios];
  }

  /**
   * Da de baja a un usuario del sistema.
   * Regla de negocio: Solo un administrador puede ejecutar la baja.
   * @param {Usuario} usuarioEjecutor - Administrador que autoriza la acción
   * @param {number|string} idUsuarioADarDeBaja - ID del usuario a eliminar
   */
  darDeBaja(usuarioEjecutor, idUsuarioADarDeBaja) {
    if (!usuarioEjecutor || !usuarioEjecutor.esAdmin()) {
      throw new Error('Acceso denegado: solo un administrador puede dar de baja usuarios.');
    }

    const indice = this.usuarios.findIndex(u => u.id === idUsuarioADarDeBaja);
    if (indice === -1) {
      throw new Error(`No se encontró el usuario con ID ${idUsuarioADarDeBaja} para dar de baja.`);
    }

    // Remueve al usuario del padrón
    const [usuarioEliminado] = this.usuarios.splice(indice, 1);
    return usuarioEliminado;
  }
}

module.exports = usuarioService;