# Sistema de Préstamos de Libros y Juegos de Mesa

Aplicación de consola desarrollada en JavaScript y Node.js para administrar usuarios, un catálogo de libros y juegos de mesa, y los préstamos de esos ítems. El sistema aplica reglas según el rol del usuario, controla el stock, calcula fechas límite y repone las unidades al registrar una devolución.

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
- Asignar un plazo de 15 días a los libros y de 5 días a los juegos de mesa.
- Registrar devoluciones, actualizar el estado del préstamo y reponer el stock.
- Consultar los préstamos propios como cliente o el historial completo y los préstamos activos como administrador.
- Registrar, buscar, listar y dar de baja usuarios; listar y dar de baja usuarios requiere permisos de administrador.
- Manejar errores para operaciones no permitidas, recursos sin stock, IDs duplicados y registros inexistentes.

Los datos se mantienen en memoria durante la ejecución; el proyecto no utiliza una base de datos ni un servidor externo.

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
git clone https://github.com/LuGerdes/Servicio-de-Prestamos.git
cd Servicio-de-Prestamos
```

Instala las dependencias del proyecto:

```bash
npm install
```

La aplicación no necesita configurar variables de entorno para la demostración actual.

## Ejecución

Inicia la simulación desde la terminal:

```bash
npm start
```

También puedes ejecutarla directamente:

```bash
node src/index.js
```

La demostración registra usuarios, agrega un libro y un juego al catálogo, solicita préstamos, muestra errores controlados para operaciones no permitidas y devuelve un préstamo para reponer el stock.

## Pruebas

Jest se instala como dependencia de desarrollo. Desde la carpeta del proyecto, ejecuta en la consola:

```bash
npm install --save-dev jest
```

Luego, ejecuta las pruebas con el script configurado en `package.json`:

```bash
npm test
```

El script `test` ejecuta Jest. En el estado actual del repositorio todavía no hay una carpeta `tests` ni archivos de prueba, por lo que primero se deben agregar pruebas para que Jest tenga casos que ejecutar.

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
- **PrestamoService:** aplica las reglas de préstamo y devolución, y controla qué préstamos puede consultar cada usuario.

## Estructura del proyecto
```text
Servicio-de-Prestamos/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── readme.md
└── src/
    ├── index.js
    ├── models/
    │   ├── ItemFactory.js
    │   ├── items.js
    │   ├── juegoDeMesa.js
    │   ├── libro.js
    │   ├── prestamo.js
    │   └── usuario.js
    └── services/
        ├── catalogoService.js
        ├── prestamoService.js
        └── usuarioService.js
```

## Alcance actual

La aplicación es una demostración ejecutada desde consola. Los datos se crean en `src/index.js` y no se conservan después de finalizar el proceso. No incluye interfaz interactiva, persistencia en base de datos, API REST ni autenticación.

## Licencia

El proyecto utiliza la licencia ISC definida en `package.json`.
