# Sistema de Prestamos de Libros y Juegos de Mesa

Proyecto para modelar el dominio y las reglas basicas de un sistema de prestamos. Es una aplicacion de consola desarrollada en JavaScript que relaciona usuarios con recursos prestables, controla la cantidad disponible y rechaza operaciones cuando no hay stock.

## Integrantes del grupo

- Gerdes Lourddes
- Minor Santiago
- Ho Fu Te

## Definicion del sistema

El sistema representa el proceso minimo de prestar un libro o juego de mesa a un usuario. Cada recurso tiene una cantidad disponible (`stock`). Al realizar un prestamo valido, el sistema descuenta una unidad, registra la fecha y devuelve la informacion basica de la operacion. Si el recurso no tiene unidades disponibles, se informa el problema mediante un error y el stock permanece sin cambios.

## Caracteristicas del proyecto

- Modelado de usuarios mediante la entidad `Usuario`.
- Modelado de libros y juegos de mesa mediante la entidad `Item`.
- Prestamo de recursos con descuento automatico del stock.
- Validacion de disponibilidad antes de modificar el inventario.
- Manejo de errores cuando se intenta prestar un recurso agotado.
- Registro de la fecha en cada prestamo exitoso.
- Ejecucion sencilla desde la terminal, sin base de datos ni servidor externo.

## Tecnologias usadas

- **JavaScript:** lenguaje de implementacion.
- **Node.js:** entorno de ejecucion de la aplicacion.
- **npm:** administrador de paquetes y encargado del script de inicio.
- **dotenv:** dependencia preparada para cargar variables de entorno en futuras configuraciones.

## Requisitos necesarios

- Node.js instalado, preferiblemente una version LTS.
- npm, incluido normalmente con Node.js.
- Git, solamente si se va a clonar el repositorio.
- Terminal o consola de comandos.

Comprobar las versiones instaladas:

```bash
node --version
npm --version
git --version
```

## Instalacion

### 1. Obtener el proyecto

Clonar el repositorio y entrar a su carpeta:

```bash
git clone https://github.com/LuGerdes/Servicio-de-Prestamos.git
cd Servicio-de-Prestamos
```

Si el proyecto ya esta descargado, basta con abrir una terminal en la carpeta `Servicio-de-Prestamos`.

### 2. Generar el archivo de configuracion

```bash
cp .env.example .env
```

### 3. Instalar dependencias

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json` y genera o actualiza `package-lock.json`.

### 4. Configuracion opcional

El repositorio incluye `.env.example` como plantilla para futuras variables de entorno. La version actual no requiere configuracion adicional para ejecutarse.

## Ejecucion

Iniciar la aplicacion con el script definido en npm:

```bash
npm start
```

Tambien puede ejecutarse directamente con Node.js:

```bash
node index.js
```

## Funcionamiento actual

El archivo `index.js` realiza una demostracion automatica:

1. Crea el usuario `Ana Perez`.
2. Crea el item `Cien Anos de Soledad` con un stock inicial de una unidad.
3. Realiza un prestamo exitoso y reduce el stock a cero.
4. Intenta prestar nuevamente el mismo item.
5. Captura y muestra el error de stock agotado.

Salida esperada:

```text
=== SISTEMA DE PRÉSTAMOS ===
Stock inicial de "Cien Años de Soledad": 1
✓ Préstamo exitoso: "Cien Años de Soledad" a Ana Pérez. Stock restante: 0
Intentando prestar de nuevo sin stock...
Error capturado correctamente: No hay stock disponible de: Cien Años de Soledad
```

Actualmente no existe una interfaz interactiva: los datos de prueba estan definidos directamente en el codigo fuente y se muestran por consola.

## Modelo del dominio

```text
Usuario 1 ─────── solicita ─────── 0..* Prestamo 0..* ─────── corresponde a ─────── 1 Item
```

### Usuario

Persona que solicita un recurso en prestamo.

| Atributo | Descripcion |
| --- | --- |
| `id` | Identificador del usuario |
| `nombre` | Nombre de la persona |

### Item

Recurso que puede ser prestado, como un libro o un juego de mesa.

| Atributo | Descripcion |
| --- | --- |
| `id` | Identificador del recurso |
| `titulo` | Nombre del libro o juego |
| `tipo` | Tipo de recurso, por ejemplo `Libro` o `Juego de mesa` |
| `stock` | Cantidad disponible |

### PrestamoService

Servicio que contiene la regla principal del dominio. Su metodo `prestar(usuario, item)`:

1. Verifica que `item.stock` sea mayor que cero.
2. Reduce el stock en una unidad.
3. Muestra la confirmacion del prestamo.
4. Devuelve el usuario, el item y la fecha de la operacion.

Cuando el stock es cero, lanza un error antes de modificar el item.

## Estructura del proyecto

```text
Servicio-de-Prestamos/
├── .env.example       # Plantilla para variables de entorno
├── .gitignore         # Archivos excluidos del control de versiones
├── index.js           # Entidades, servicio y demostracion por consola
├── package.json       # Metadatos, dependencia y script de inicio
├── package-lock.json  # Versiones exactas de dependencias
└── readme.md          # Documentacion del proyecto
```

## Alcance y decisiones del Taller 1

El alcance actual se concentra en identificar las entidades principales y demostrar una regla de negocio esencial: no se puede prestar un item sin stock. Para mantener el ejercicio simple, la informacion vive en memoria, la ejecucion es local y no se incorporan todavia persistencia, autenticacion ni una API.

## Futuras mejoras

- Crear un catalogo de varios libros y juegos de mesa.
- Agregar operaciones de devolucion y reposicion del stock.
- Permitir registrar, buscar y eliminar usuarios e items.
- Validar datos de entrada y evitar prestamos duplicados.
- Persistir la informacion en una base de datos.
- Crear una API REST y una interfaz web.
- Incorporar estados del prestamo, fechas limite y multas.
- Agregar pruebas automatizadas unitarias y de integracion.
- Configurar linting, integracion continua y cobertura de codigo.

## Licencia

El proyecto utiliza la licencia ISC definida en `package.json`.