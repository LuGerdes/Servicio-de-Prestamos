# Sistema de Préstamos de Libros y Juegos de Mesa

Aplicación desarrollada en JavaScript y Node.js para administrar usuarios, un catálogo de libros y juegos de mesa, y los préstamos de esos ítems. El sistema cuenta tanto con una simulación por consola como con una API REST en Express conectada a una interfaz web en React. Aplica reglas según el rol del usuario, controla el stock, limita la cantidad de préstamos activos por cliente, calcula fechas límite y repone las unidades al registrar una devolución.

## Integrantes

- Gerdes Lourddes
- Minor Santiago
- Ho Fu Te

## Funcionalidades

- Registrar usuarios con rol de `admin` o `cliente`.
- Crear libros y juegos de mesa mediante `ItemFactory`.
- Agregar ítems al catálogo únicamente con un usuario administrador; se rechazan IDs duplicados.
- Consultar el catálogo, buscar ítems por ID y filtrar por tipo.
- Solicitar préstamos para clientes, siempre que haya stock disponible. Los administradores no pueden retirar ítems.
- Controlar límites de préstamo: impedir que un cliente solicite dos ejemplares activos del mismo ítem y establecer un máximo de 3 préstamos activos simultáneos por usuario.
- Asignar un plazo de 15 días a los libros y de 5 días a los juegos de mesa.
- Registrar devoluciones, actualizar el estado del préstamo y reponer el stock automáticamente.
- Consultar los préstamos propios como cliente o el historial completo y los préstamos activos como administrador.
- Registrar, buscar, listar y dar de baja usuarios; listar y dar de baja usuarios requiere permisos de administrador.
- Manejar errores controlados para operaciones no permitidas, recursos sin stock, límites alcanzados, IDs duplicados y registros inexistentes.

Los datos se mantienen en memoria durante la ejecución; el proyecto no utiliza una base de datos externa.

## Tecnologías y requisitos

- Node.js (versión LTS recomendada).
- npm, incluido normalmente con Node.js.
- Git, si se desea clonar el repositorio.

Verifica las instalaciones con:

```bash
node --version
npm --version
```

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone [https://github.com/LuGerdes/Servicio-de-Prestamos.git](https://github.com/LuGerdes/Servicio-de-Prestamos.git)
cd Servicio-de-Prestamos
```

Instala las dependencias del backend:

```bash
npm install
```

Instala las dependencias del frontend:

```bash
cd frontend
npm install
cd ..
```

La aplicación no necesita configurar variables de entorno para la demostración actual.

## Ejecución

### Opción 1: Ejecución por consola (simulación)

Inicia la simulación desde la terminal:

```bash
npm start
```

También puedes ejecutarla directamente:

```bash
node src/index.js
```

La demostración registra usuarios, agrega un libro y un juego al catálogo, solicita préstamos, muestra errores controlados para operaciones no permitidas y devuelve un préstamo para reponer el stock.

### Opción 2: Aplicación Web (API REST + Frontend React)

Para utilizar la interfaz gráfica en el navegador, se deben levantar ambos servicios en dos terminales simultáneas:

1. **Terminal 1 — Levantar el servidor Backend (API REST en puerto `3000`):**

```bash
node src/server.js
```

2. **Terminal 2 — Levantar la interfaz Frontend (React + Vite en puerto `5173`):**

```bash
cd frontend
npm run dev
```

Luego ingresa desde el navegador a `http://localhost:5173` para explorar el catálogo disponible, solicitar préstamos, visualizar los préstamos activos y registrar devoluciones.

## Pruebas y Calidad

Desde la carpeta raíz del proyecto, ejecuta las pruebas automatizadas con Jest:

```bash
npm test
```

Para ejecutar el análisis estático de calidad con ESLint:

```bash
npm run lint
```

Para ejecutar ESLint y luego Jest encadenados:

```bash
npm run check
```

## Calidad de Código y Limpieza

Se configuró ESLint mediante `eslint.config.mjs` para realizar análisis estático sobre el código fuente y las pruebas.

También se realizaron las siguientes mejoras de calidad y reglas de negocio:

- Se eliminó la importación sin uso de `Usuario` en `src/services/usuarioService.js`.
- Se amplió la suite de pruebas de `src/tests/CatalogoService.test.js` para comprobar que un usuario con rol `cliente` no puede agregar ítems al catálogo.
- Se incorporaron validaciones en `src/services/prestamoService.js` para evitar préstamos duplicados de un mismo ítem activo y limitar a 3 los préstamos simultáneos por cliente.

## Modelo y reglas principales

```text
Usuario ─── solicita ─── Prestamo ─── corresponde a ─── Item
                                                       ├── Libro
                                                       └── JuegoDeMesa
```

- **Usuario:** tiene ID, nombre, correo y rol. El rol predeterminado es `cliente`.
- **Item:** contiene ID, título, descripción, plazo del préstamo y stock. `Libro` y `JuegoDeMesa` heredan las operaciones para consultar disponibilidad, descontar stock y reponerlo.
- **Libro:** plazo de préstamo de 15 días; puede incluir edad recomendada y género.
- **JuegoDeMesa:** plazo de préstamo de 5 días; puede incluir características, edad recomendada y cantidad de jugadores.
- **Prestamo:** registra usuario, ítem, fecha de inicio, fecha límite, fecha de devolución y estado (`activo` o `devuelto`). También permite consultar si un préstamo activo está vencido.
- **ItemFactory:** crea libros o juegos de mesa a partir del tipo solicitado.
- **CatalogoService:** gestiona el catálogo y aplica el permiso de administrador al agregar ítems.
- **UsuarioService:** administra usuarios y protege las operaciones de listado y baja con permisos de administrador.
- **PrestamoService:** aplica las reglas de préstamo, topes por usuario y devolución, y controla qué préstamos puede consultar cada usuario.

## Estructura del proyecto

```text
Servicio-de-Prestamos/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── readme.md
├── docs/
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       └── main.jsx
└── src/
    ├── index.js
    ├── server.js
    ├── models/
    │   ├── ItemFactory.js
    │   ├── items.js
    │   ├── juegoDeMesa.js
    │   ├── libro.js
    │   ├── prestamo.js
    │   └── usuario.js
    ├── services/
    │   ├── catalogoService.js
    │   ├── prestamoService.js
    │   └── usuarioService.js
    └── tests/
        ├── CatalogoService.test.js
        └── PrestamoService.test.js
```

## Alcance actual

La aplicación cuenta con una demostración por consola (`src/index.js`) y una interfaz web funcional en React (`frontend/`) conectada a una API REST en Express (`src/server.js`). Los datos se mantienen en memoria durante la ejecución y no se conservan al reiniciar el servidor. No incluye persistencia en base de datos ni sistema de autenticación.

## Licencia

El proyecto utiliza la licencia ISC definida en `package.json`.