const Item = require('./items');

class JuegoDeMesa extends Item {
    constructor(id, titulo, descripcion, stock, caracteristicas, edadRecomendada, cantidadJugadores){
        super(id, titulo, descripcion, 5, stock);
        this.caracteristicas = caracteristicas;
        this.edadRecomendada = edadRecomendada;
        this.cantidadJugadores = cantidadJugadores;
        
    }
}

module.exports = JuegoDeMesa;