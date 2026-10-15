const Libro = require('./libro');
const JuegoDeMesa = require('./juegoDeMesa');

class ItemFactory {
  /**
   * Centraliza la instanciación de las variantes de ítems.
   * @param {string} tipo - 'libro' o 'juego'
   * @param {object} datos - Parámetros requeridos para cada subclase
   */
  static crearItem(tipo, datos) {
    const tipoNormalizado = tipo ? tipo.toLowerCase().trim() : '';

    switch (tipoNormalizado) {
      case 'libro':
        // Constructor de Libro: (id, titulo, descripcion, stock, edadRecomendada)
        return new Libro(
          datos.id,
          datos.titulo,
          datos.descripcion,
          datos.stock,
          datos.edadRecomendada,
          datos.genero
        );

      case 'juego':
      case 'juegodemesa':
        // Constructor de JuegoDeMesa: (id, titulo, descripcion, stock, caracteristicas, edadMinima, cantidadJugadores)
        return new JuegoDeMesa(
          datos.id,
          datos.titulo,
          datos.descripcion,
          datos.stock,
          datos.caracteristicas,
          datos.edadMinima,
          datos.cantidadJugadores
        );

      default:
        throw new Error(`Tipo de ítem no soportado: "${tipo}". Tipos válidos: 'libro', 'juego'.`);
    }
  }
}

module.exports = ItemFactory;