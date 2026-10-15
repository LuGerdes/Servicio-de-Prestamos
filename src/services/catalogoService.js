// src/services/CatalogoService.js
const ItemFactory = require('../models/ItemFactory');

class catalogoService {
  /**
   * Inicializa el catálogo con una lista vacía o con ítems preexistentes.
   * @param {Array} itemsIniciales 
   */
  constructor(itemsIniciales = []) {
    this.items = [...itemsIniciales];
  }

  /**
   * Consulta pública: accesible para clientes y administradores.
   * Retorna una copia superficial para proteger la referencia interna.
   */
  obtenerCatalogo() {
    return [...this.items];
  }

  /**
   * Busca un ítem específico por su ID.
   * @param {number|string} id 
   */
  buscarPorId(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) {
      throw new Error(`Ítem con ID ${id} no encontrado en el catálogo.`);
    }
    return item;
  }

  /**
   * Filtra ítems según su tipo ('libro' o 'juego').
   * @param {string} tipo 
   */
  filtrarPorTipo(tipo) {
    const tipoBuscado = tipo.toLowerCase().trim();
    return this.items.filter(item => {
      // Si el objeto tiene la propiedad tipo o se identifica por clase
      return item.tipo?.toLowerCase() === tipoBuscado || 
             item.constructor.name.toLowerCase() === tipoBuscado;
    });
  }

  /**
   * Alta de ítem en el catálogo.
   * Regla de negocio: Exclusivo para administradores.
   * 
   * @param {Usuario} usuarioEjecutor - Usuario que solicita la operación
   * @param {string} tipo - 'libro' o 'juego'
   * @param {object} datosItem - Atributos requeridos por la Factory
   */
  agregarItem(usuarioEjecutor, tipo, datosItem) {
    if (!usuarioEjecutor || !usuarioEjecutor.esAdmin()) {
      const nombre = usuarioEjecutor ? usuarioEjecutor.nombre : 'Desconocido';
      throw new Error(`Acceso denegado: el usuario "${nombre}" no tiene permisos de administrador para agregar ítems.`);
    }

    // Valida que no exista un ítem con el mismo ID
    const existe = this.items.some(i => i.id === datosItem.id);
    if (existe) {
      throw new Error(`Ya existe un ítem en el catálogo con el ID ${datosItem.id}.`);
    }

    // Delega la creación en la ItemFactory
    const nuevoItem = ItemFactory.crearItem(tipo, datosItem);
    this.items.push(nuevoItem);
    return nuevoItem;
  }
}

module.exports = catalogoService;