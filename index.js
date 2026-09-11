/*/
// Entidad Item (Libro o Juego)
class Item {
  constructor(id, titulo, tipo, stock) {
    this.id = id;
    this.titulo = titulo;
    this.tipo = tipo;
    this.stock = stock;
  }
}

// Entidad Usuario
class Usuario {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }
}

// Servicio con regla de negocio
class PrestamoService {
  static prestar(usuario, item) {
    if (item.stock <= 0) {
      throw new Error(No hay stock disponible de: ${item.titulo});
    }
    item.stock -= 1;
    console.log(✓ Préstamo exitoso: "${item.titulo}" a ${usuario.nombre}. Stock restante: ${item.stock});
    return { usuario: usuario.nombre, item: item.titulo, fecha: new Date() };
  }
}

// Validación y prueba por consola
console.log("=== SISTEMA DE PRÉSTAMOS ===");
const usuario = new Usuario(1, "Ana Pérez");
const libro = new Item(101, "Cien Años de Soledad", "Libro", 1);

console.log(Stock inicial de "${libro.titulo}": ${libro.stock});
PrestamoService.prestar(usuario, libro);

try {
  console.log("Intentando prestar de nuevo sin stock...");
  PrestamoService.prestar(usuario, libro);
} catch (error) {
  console.log(Error capturado correctamente: ${error.message});
} 
/*/