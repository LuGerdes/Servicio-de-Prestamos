// src/index.js
const Usuario = require('./models/usuario');
const CatalogoService = require('./services/catalogoService');
const UsuarioService = require('./services/usuarioService');
const PrestamoService = require('./services/prestamoService');

console.log('=========================');
console.log(' SISTEMA DE PRÉSTAMOS');
console.log('=========================\n');

// 1. Inicialización de Servicios
const catalogoService = new CatalogoService();
const usuarioService = new UsuarioService();
const prestamoService = new PrestamoService();

// 2. Registro de Usuarios
console.log('--- 1. Registrando Usuarios ---');
const admin = new Usuario(1, 'Carlos Admin', 'admin@sistema.com', 'admin');
const socioAna = new Usuario(2, 'Ana Pérez', 'ana@gmail.com', 'cliente');
const socioLucas = new Usuario(3, 'Lucas Díaz', 'lucas@gmail.com', 'cliente');

usuarioService.registrarUsuario(admin);
usuarioService.registrarUsuario(socioAna);
usuarioService.registrarUsuario(socioLucas);
console.log('✓ Usuarios dados de alta correctamente.');

// 3. Alta de Ítems en Catálogo (Validación de Rol Admin)
console.log('\n--- 2. Poblando Catálogo vía ItemFactory ---');
const libro1 = catalogoService.agregarItem(admin, 'libro', {
  id: 101,
  titulo: 'Rayuela',
  descripcion: 'Novela clásica',
  stock: 1, // Stock reducido a propósito para probar el límite
  edadRecomendada: 16
});

const juego1 = catalogoService.agregarItem(admin, 'juego', {
  id: 201,
  titulo: 'Catan',
  descripcion: 'Juego de mesa estratégico',
  stock: 2,
  caracteristicas: 'tablero y dados',
  edadMinima: 10,
  cantidadJugadores: '3-4'
});
console.log(`✓ Agregado: "${libro1.titulo}" (Stock: ${libro1.stock}) - Plazo: ${libro1.diasPrestamo} días.`);
console.log(`✓ Agregado: "${juego1.titulo}" (Stock: ${juego1.stock}) - Plazo: ${juego1.diasPrestamo} días.`);

// 4. Préstamos Exitosos
console.log('\n--- 3. Solicitando Préstamos Válidos ---');
const prestamoAna = prestamoService.solicitarPrestamo(socioAna, libro1);
console.log(`✓ Préstamo #${prestamoAna.id} registrado para ${socioAna.nombre}: "${libro1.titulo}".`);
console.log(`  Stock restante: ${libro1.stock} | Límite: ${prestamoAna.fechaLimite.toLocaleDateString()}`);

const prestamoLucas = prestamoService.solicitarPrestamo(socioLucas, juego1);
console.log(`✓ Préstamo #${prestamoLucas.id} registrado para ${socioLucas.nombre}: "${juego1.titulo}".`);
console.log(`  Stock restante: ${juego1.stock} | Límite: ${prestamoLucas.fechaLimite.toLocaleDateString()}`);

// 5. Casos de Error Controlados
console.log('\n--- 4. Validando Restricciones y Reglas de Negocio ---');

// Intento A: Préstamo sin stock
try {
  console.log('Intentando prestar "Rayuela" a Lucas (Stock actual: 0)...');
  prestamoService.solicitarPrestamo(socioLucas, libro1);
} catch (error) {
  console.log(`✓ Error capturado exitosamente: ${error.message}`);
}

// Intento B: Admin intentando retirar préstamo
try {
  console.log('Intentando registrar préstamo a nombre del administrador...');
  prestamoService.solicitarPrestamo(admin, juego1);
} catch (error) {
  console.log(`✓ Error capturado exitosamente: ${error.message}`);
}

// Intento C: Socio intentando agregar ítems al catálogo
try {
  console.log('Intentando agregar ítem con usuario no administrador...');
  catalogoService.agregarItem(socioAna, 'libro', { id: 102, titulo: 'Ficciones', stock: 1, edadRecomendada: 12 });
} catch (error) {
  console.log(`✓ Error capturado exitosamente: ${error.message}`);
}

// 6. Devolución y Reposición de Stock
console.log('\n--- 5. Devolución de Préstamo ---');
console.log(`Stock de "${libro1.titulo}" antes de devolver: ${libro1.stock}`);
prestamoService.devolverPrestamo(prestamoAna.id);
console.log(`✓ Préstamo #${prestamoAna.id} marcado como devuelto.`);
console.log(`Stock de "${libro1.titulo}" tras devolución: ${libro1.stock}`);

console.log('\n====================================================');
console.log(' SIMULACIÓN FINALIZADA CON ÉXITO');
console.log('====================================================');