
class Prestamo {
  /**
   * Representa la transacción y vigencia de un préstamo.
   * @param {number|string} id - Identificador del préstamo
   * @param {Usuario} usuario - Socio que solicita
   * @param {Item} item - Ejemplar prestado (Libro o JuegoDeMesa)
   * @param {Date} [fechaInicio=new Date()] - Fecha en que se retira
   */
  constructor(id, usuario, item, fechaInicio = new Date()) {
    this.id = id;
    this.usuario = usuario;
    this.item = item;
    this.fechaInicio = fechaInicio;
    this.fechaLimite = this._calcularFechaLimite(fechaInicio, item.diasPrestamo);
    this.fechaDevolucion = null;
    this.estado = 'activo'; // 'activo' | 'devuelto'
  }

  // Método auxiliar privado para sumar los días según el ítem
  _calcularFechaLimite(fecha, dias) {
    const limite = new Date(fecha);
    limite.setDate(limite.getDate() + dias);
    return limite;
  }

  // Comportamiento del dominio: registrar la devolución
  marcarDevuelto() {
    this.estado = 'devuelto';
    this.fechaDevolucion = new Date();
    this.item.reponerStock();
  }

  // Consulta de estado
  estaVencido() {
    if (this.estado === 'devuelto') return false;
    return new Date() > this.fechaLimite;
  }
}

module.exports = Prestamo;