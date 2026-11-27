# Sistema de Préstamos de Libros y Juegos de Mesa

Aplicación web full-stack para administrar usuarios, catalogar libros y juegos de mesa y gestionar préstamos. El proyecto fue desarrollado con Node.js, Express y React, y aplica reglas de negocio según el rol del usuario, el stock disponible y las características de cada ítem.

Los datos se mantienen en memoria durante la ejecución del servidor. Por lo tanto, reiniciar el backend restablece usuarios, catálogo y préstamos.

## Integrantes

- Gerdes Lourddes
- Minor Santiago
- Ho Fu Te

## Funcionalidades

### Usuarios y permisos

- Registra usuarios con los roles `admin` o `cliente`.
- Impide registrar usuarios con identificadores duplicados.
- Restringe la consulta del padrón y la baja de usuarios a administradores.
- Impide que un administrador solicite préstamos a su nombre.

### Catálogo

- Crea libros y juegos de mesa mediante el patrón Factory.
- Permite agregar ítems únicamente a usuarios administradores.
- Rechaza identificadores de ítems duplicados.
- Permite consultar el catálogo completo y buscar o filtrar ítems por identificador y tipo.
- Representa y controla el stock disponible de cada recurso.

### Préstamos

- Permite solicitar préstamos a usuarios con rol `cliente`.
- Asigna 15 días de plazo a los libros y 5 días a los juegos de mesa.
- Descuenta una unidad del stock al crear un préstamo.
- Repone una unidad del stock al registrar una devolución.
- Marca los préstamos como activos o devueltos.
- Permite consultar los préstamos activos de un cliente.
- Los administradores pueden consultar el historial completo y los préstamos activos globales.

El sistema devuelve mensajes de error controlados ante recursos sin stock, permisos insuficientes, IDs duplicados y registros inexistentes.

## Tecnologías

- **Backend:** Node.js y Express
- **Frontend:** React y Vite
- **Pruebas:** Jest
- **Calidad de código:** ESLint
- **Gestión de paquetes:** npm
- **Control de versiones:** Git

## Requisitos

Se recomienda una versión LTS de Node.js y una instalación actual de npm.

```bash
node --version
npm --version
```

## Instalación

Clonar el repositorio y ubicarse en la carpeta principal:

```bash
git clone https://github.com/LuGerdes/Servicio-de-Prestamos
cd Servicio-de-Prestamos
npm install
```

Instalar las dependencias del frontend:

```bash
cd frontend
npm install
cd ..
```

## Ejecución

### Backend

Desde la raíz del proyecto, iniciar la API:

```bash
cd backend
node src/server.js
```

El backend queda disponible en:

```text
http://localhost:3000
```

### Frontend

Desde otra terminal, ingresar a la carpeta del frontend:

```bash
cd frontend
npm run dev
```

Vite mostrará la dirección local donde puede abrirse la aplicación, normalmente:

```text
http://localhost:5173
```

El frontend consume el backend desde `http://localhost:3000` y utiliza como usuario activo al cliente con ID `2` (Lourdes). La API incluye datos iniciales de demostración:

- Administrador: ID `1`
- Cliente: ID `2`
- Libro Rayuela: ID `101`
- Juego Catan: ID `102`

## API REST

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/catalogo` | Lista el catálogo disponible. |
| `POST` | `/api/prestamos` | Crea un préstamo. Recibe `usuarioId` y `itemId`. |
| `GET` | `/api/prestamos/:usuarioId` | Lista los préstamos activos de un usuario. |
| `POST` | `/api/prestamos/:prestamoId/devolver` | Registra una devolución y repone el stock. |

### Ejemplo: solicitar un préstamo

```bash
curl -X POST http://localhost:3000/api/prestamos \
  -H "Content-Type: application/json" \
  -d '{"usuarioId": 2, "itemId": 101}'
```

### Ejemplo: consultar préstamos activos

```bash
curl http://localhost:3000/api/prestamos/2
```

### Ejemplo: registrar una devolución

```bash
curl -X POST http://localhost:3000/api/prestamos/1/devolver
```

Las solicitudes inválidas responden con estado HTTP `400` y un mensaje JSON en la propiedad `error`.

## Pruebas y calidad

Desde la raíz del proyecto:

```bash
npm test
npm run lint
```

Para ejecutar lint y pruebas de forma consecutiva:

```bash
npm run check
```

Para compilar el frontend:

```bash
cd frontend
npm run build
npm run lint
```

## Arquitectura

El backend aplica una separación entre modelos y servicios:

- `models/`: entidades del dominio, como usuario, ítem, préstamo, libro y juego de mesa.
- `services/`: operaciones de catálogo, usuarios y préstamos.
- `ItemFactory.js`: construcción polimórfica de libros y juegos de mesa.
- `server.js`: configuración de Express, datos iniciales y exposición de rutas REST.
- `tests/`: pruebas unitarias de servicios y reglas de negocio.

El frontend está dividido entre componentes React, estilos y recursos estáticos dentro de `frontend/src` y se comunica con el backend mediante `fetch`.

## Estructura del proyecto

```text
Servicio-de-Prestamos/
├── backend/
│   └── src/
│       ├── models/
│       │   ├── itemFactory.js
│       │   ├── items.js
│       │   ├── juegoDeMesa.js
│       │   ├── libro.js
│       │   ├── prestamo.js
│       │   └── usuario.js
│       ├── services/
│       │   ├── catalogoService.js
│       │   ├── prestamoService.js
│       │   └── usuarioService.js
│       ├── tests/
│       │   ├── CatalogoService.test.js
│       │   └── PrestamoService.test.js
│       ├── index.js
│       └── server.js
├── docs/
│   └── markdown.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── package.json
├── package-lock.json
└── readme.md
```

## Nota sobre persistencia

Actualmente no existe una base de datos externa ni persistencia en disco. Las modificaciones realizadas mientras el servidor está activo se pierden al detenerlo o reiniciarlo.