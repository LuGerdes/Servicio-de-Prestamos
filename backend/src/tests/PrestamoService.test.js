// src/tests/PrestamoService.test.js
const PrestamoService = require('../services/prestamoService');
const ItemFactory = require('../models/ItemFactory');
const Usuario = require('../models/usuario');

describe('Pruebas unitarias sobre PrestamoService', () => {
  let prestamoService;
  let socio;
  let admin;
  let juego;

  beforeEach(() => {
    prestamoService = new PrestamoService();
    socio = new Usuario(10, 'Ana Gómez', 'ana@mail.com', 'cliente');
    admin = new Usuario(99, 'Admin Carlos', 'admin@mail.com', 'admin');
    juego = ItemFactory.crearItem('juego', {
      id: 50,
      titulo: 'Catan',
      descripcion: 'Juego de mesa',
      stock: 1,
      caracteristicas: 'tablero',
      edadMinima: 10,
      cantidadJugadores: '3-4'
    });
  });

  test('Debe concretar un préstamo reduciendo el stock disponible en 1', () => {
    const prestamo = prestamoService.solicitarPrestamo(socio, juego);

    expect(prestamo.estado).toBe('activo');
    expect(juego.stock).toBe(0);
    expect(prestamo.item.diasPrestamo).toBe(5);
  });

  test('Debe arrojar un error de dominio si se intenta prestar un ítem sin stock', () => {
    // Primer préstamo consume la única unidad disponible
    prestamoService.solicitarPrestamo(socio, juego);

    // Segundo intento debe lanzar la excepción
    expect(() => {
      prestamoService.solicitarPrestamo(socio, juego);
    }).toThrow(/No hay stock disponible/);
  });

  test('Debe impedir que un usuario administrador solicite préstamos', () => {
    expect(() => {
      prestamoService.solicitarPrestamo(admin, juego);
    }).toThrow(/Los administradores no pueden retirar préstamos/);
  });

  test('Debe reponer el stock al registrar la devolución del ejemplar', () => {
    const prestamo = prestamoService.solicitarPrestamo(socio, juego);
    expect(juego.stock).toBe(0);

    prestamoService.devolverPrestamo(prestamo.id);
    expect(prestamo.estado).toBe('devuelto');
    expect(juego.stock).toBe(1);
  });
});