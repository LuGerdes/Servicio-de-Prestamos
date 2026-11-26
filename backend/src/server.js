const express = require('express');
const cors = require('cors');

const CatalogoService = require('./services/catalogoService');
const PrestamoService = require('./services/prestamoService');
const UsuarioService = require('./services/usuarioService');
const Usuario = require('./models/usuario');

const app = express();
app.use(cors());
app.use(express.json());

const catalogoService = new CatalogoService();
const usuarioService = new UsuarioService();
const prestamoService = new PrestamoService();

// Datos iniciales de prueba
const admin = new Usuario(1, 'Admin General', 'admin@mail.com', 'admin');
const cliente = new Usuario(2, 'Lourdes', 'lourdes@mail.com', 'cliente');
usuarioService.registrarUsuario(admin);
usuarioService.registrarUsuario(cliente);

catalogoService.agregarItem(admin, 'libro', {
  id: 101,
  titulo: 'Rayuela',
  descripcion: 'Novela de Julio Cortázar',
  stock: 3,
  edadRecomendada: 16
});

catalogoService.agregarItem(admin, 'juego', {
  id: 102,
  titulo: 'Catan',
  descripcion: 'Juego de estrategia y comercio',
  stock: 2,
  edadRecomendada: 10
});


app.get('/api/catalogo', (req, res) => {
  res.json(catalogoService.obtenerCatalogo());
});

app.post('/api/prestamos', (req, res) => {
  try {
    const { usuarioId, itemId } = req.body;
    const usuario = usuarioService.buscarPorId(Number(usuarioId));
    const item = catalogoService.obtenerCatalogo().find((i) => i.id === Number(itemId));

    const prestamo = prestamoService.solicitarPrestamo(usuario, item);
    res.status(201).json(prestamo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Listar préstamos activos del usuario cliente
app.get('/api/prestamos/:usuarioId', (req, res) => {
  try {
    const usuario = usuarioService.buscarPorId(Number(req.params.usuarioId));
    // Reutilizamos tu lógica del servicio (o filtramos los activos del usuario)
    const misPrestamos = prestamoService.prestamos.filter(
      (p) => p.usuario.id === usuario.id && p.estado === 'activo'
    );
    res.json(misPrestamos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Registrar devolución y reponer stock
// 4. Registrar devolución y reponer stock
app.post('/api/prestamos/:prestamoId/devolver', (req, res) => {
  try {
    const prestamoId = Number(req.params.prestamoId);
    const prestamoDevuelto = prestamoService.devolverPrestamo(prestamoId);
    res.json({ mensaje: 'Devolución registrada y stock repuesto', prestamo: prestamoDevuelto });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});