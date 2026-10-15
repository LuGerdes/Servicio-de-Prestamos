class Item {
    constructor(id, titulo, descripcion, diasPrestamo, stock){
      this.id = id;
      this.titulo = titulo;
      this.descripcion = descripcion;
      this.diasPrestamo = diasPrestamo;
      this.stock = stock;

}
    hayDisponibilidad() {
        return this.stock > 0;
    }

    descontarStock() {
    if (!this.hayDisponibilidad()) {
      throw new Error(`No hay stock disponible de: ${this.titulo}`);
    }
    this.stock -= 1;
    }

    reponerStock() {
    this.stock += 1;
    }
}

module.exports = Item;