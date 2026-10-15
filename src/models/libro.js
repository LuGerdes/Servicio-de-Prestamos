const Item = require('./items');

class Libro extends Item {
    constructor(id, titulo, descripcion, stock, edadRecomendada, genero) {
        super(id, titulo, descripcion, 15, stock);
        this.edadRecomendada = edadRecomendada;
        this.genero = genero;
    }
}

module.exports = Libro;