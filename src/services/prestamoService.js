// src/services/PrestamoService.js
const Prestamo = require('../models/prestamo');

class prestamoService {
  /**
   * Inicializa el servicio con un registro de préstamos en memoria.
   * @param {Array<Prestamo>} prestamosIniciales 
   */
  constructor(prestamosIniciales = []) {
    this.prestamos = [...prestamosIniciales];
    this.siguienteId = this.prestamos.length + 1;
  }

  /**
   * Realiza la solicitud y registro de un nuevo préstamo.
   * 
   * @param {Usuario} usuario - Socio que solicita el ejemplar
   * @param {Item} item - Recurso del catálogo (Libro o JuegoDeMesa)
   * @returns {Prestamo}
   */
  solicitarPrestamo(usuario, item) {
    if (!usuario) {
      throw new Error('Debe indicarse un usuario válido para realizar el préstamo.');
    }

    if (usuario.esAdmin()) {
      throw new Error('Los administradores no pueden retirar préstamos a su nombre.');
    }

    if (!item || !item.hayDisponibilidad()) {
      const nombreItem = item ? `"${item.titulo}"` : 'solicitado';
      throw new Error(`No hay stock disponible del ítem ${nombreItem}.`);
    }

    // Aplica efecto en el dominio
    item.descontarStock();

    // Crea el registro del préstamo (aplica polimórficamente los días del ítem)
    const nuevoPrestamo = new Prestamo(this.siguienteId++, usuario, item);
    this.prestamos.push(nuevoPrestamo);

    return nuevoPrestamo;
  }

  /**
   * Registra la devolución de un ejemplar prestado.
   * 
   * @param {number|string} idPrestamo 
   * @returns {Prestamo}
   */
  devolverPrestamo(idPrestamo) {
    const prestamo = this.prestamos.find(p => p.id === idPrestamo);

    if (!prestamo) {
      throw new Error(`No se encontró el préstamo con ID ${idPrestamo}.`);
    }

    if (prestamo.estado === 'devuelto') {
      throw new Error(`El préstamo con ID ${idPrestamo} ya fue devuelto previamente.`);
    }

    // Marca la fecha de entrega y repone automáticamente el stock del ítem
    prestamo.marcarDevuelto();
    return prestamo;
  }

  /**
   * Consulta los préstamos según los permisos del usuario que consulta.
   * 
   * @param {Usuario} usuarioConsultante - Quien realiza la consulta
   * @returns {Array<Prestamo>}
   */
  consultarPrestamos(usuarioConsultante) {
    if (!usuarioConsultante) {
      throw new Error('Usuario inválido para realizar la consulta.');
    }

    if (usuarioConsultante.esAdmin()) {
      // El administrador tiene visibilidad total del historial
      return [...this.prestamos];
    }

    // El cliente solo puede visualizar sus propios préstamos
    return this.prestamos.filter(p => p.usuario.id === usuarioConsultante.id);
  }

  /**
   * Retorna únicamente los préstamos que continúan abiertos/activos.
   * Exclusivo para administradores o monitoreo.
   * 
   * @param {Usuario} usuarioEjecutor
   * @returns {Array<Prestamo>}
   */
  listarPrestamosActivos(usuarioEjecutor) {
    if (!usuarioEjecutor || !usuarioEjecutor.esAdmin()) {
      throw new Error('Acceso denegado: solo un administrador puede listar préstamos activos globales.');
    }
    return this.prestamos.filter(p => p.estado === 'activo');
  }
}

module.exports = prestamoService;