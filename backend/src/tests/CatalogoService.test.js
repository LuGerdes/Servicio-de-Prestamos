// src/tests/CatalogoService.test.js
const CatalogoService = require('../services/catalogoService');
const Usuario = require('../models/usuario');

describe('Pruebas unitarias sobre CatalogoService', () => {
  let catalogoService;
  let admin;
  let cliente; 
  
  beforeEach(() => {
    // Se inicializa un servicio limpio antes de cada prueba (sin estado residual)
    catalogoService = new CatalogoService();
    admin = new Usuario(1, 'Admin General', 'admin@mail.com', 'admin');
    cliente = new Usuario(2, 'Juan Pérez', 'juan@mail.com', 'cliente');
  });

  test('Debe permitir a un administrador agregar un libro mediante la fábrica', () => {
    const nuevoLibro = catalogoService.agregarItem(admin, 'libro', {
      id: 1,
      titulo: 'Rayuela',
      descripcion: 'Novela',
      stock: 5,
      edadRecomendada: 16
    });

    expect(nuevoLibro.titulo).toBe('Rayuela');
    expect(nuevoLibro.diasPrestamo).toBe(15);
    expect(catalogoService.obtenerCatalogo()).toHaveLength(1);
  });

  test('Debe impedir que un cliente agregue un ítem al catálogo', () => {
    expect(() => {
      catalogoService.agregarItem(cliente, 'libro', {
        id: 2,
        titulo: 'El túnel',
        descripcion: 'Novela',
        stock: 3,
        edadRecomendada: 16
      });
    }).toThrow(/no tiene permisos de administrador/);
  });
});