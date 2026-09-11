# Sistema de Prestamos de Libros y Juegos de Mesa

Aplicacion de consola desarrollada en JavaScript para representar el flujo basico de un sistema de prestamos. El sistema permite asociar usuarios con items disponibles, controlar el stock y rechazar prestamos cuando no quedan unidades.

## Caracteristicas

- Representacion de libros y juegos de mesa mediante la entidad `Item`.
- Registro basico de usuarios mediante la entidad `Usuario`.
- Prestamo de items con descuento automatico del stock.
- Validacion de disponibilidad antes de realizar un prestamo.
- Manejo de errores cuando un item no tiene stock.
- Registro de la fecha en cada prestamo exitoso.

## Tecnologias

- Node.js
- JavaScript
- npm

## Requisitos

- Node.js instalado.
- npm, incluido normalmente con Node.js.

Puedes comprobar las versiones instaladas con:

```bash
node --version
npm --version
```

## Instalacion

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/LuGerdes/Servicio-de-Prestamos.git
cd Servicio-de-Prestamos
```

Instala las dependencias:

```bash
npm install
```

## Ejecucion

Inicia el programa con:

```bash
npm start
```

Tambien puedes ejecutarlo directamente:

```bash
node index.js
```

## Funcionamiento actual

El ejemplo crea un usuario, registra un libro con una unidad disponible y realiza un prestamo. Despues intenta prestar nuevamente el mismo libro para demostrar la validacion de stock.

Salida esperada:

```text
=== SISTEMA DE PRÉSTAMOS ===
Stock inicial de "Cien Años de Soledad": 1
✓ Préstamo exitoso: "Cien Años de Soledad" a Ana Pérez. Stock restante: 0
Intentando prestar de nuevo sin stock...
Error capturado correctamente: No hay stock disponible de: Cien Años de Soledad
```

## Modelo del dominio

### Item

Representa un recurso que puede prestarse.

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador del item |
| `titulo` | Nombre del libro o juego |
| `tipo` | Tipo de item, por ejemplo `Libro` o `Juego de mesa` |
| `stock` | Cantidad disponible para prestar |

### Usuario

Representa a la persona que solicita un prestamo.

| Campo | Descripcion |
| --- | --- |
| `id` | Identificador del usuario |
| `nombre` | Nombre de la persona |

### PrestamoService

La operacion `prestar(usuario, item)` realiza estas acciones:

1. Comprueba que el item tenga stock disponible.
2. Reduce el stock en una unidad.
3. Muestra un mensaje de confirmacion.
4. Devuelve los datos del prestamo y su fecha.

Cuando el stock es cero, la operacion lanza un error y el stock no se modifica.

## Estructura del proyecto

```text
Servicio-de-Prestamos/
├── index.js
├── package.json
├── package-lock.json
└── readme
```

## Proximas mejoras

- Agregar un catalogo de varios libros y juegos de mesa.
- Incorporar devoluciones y actualizacion del stock.
- Validar usuarios y evitar prestamos duplicados.
- Guardar la informacion en una base de datos.
- Crear una API REST o una interfaz web.
- Agregar pruebas automatizadas.

## Autor

Proyecto de practica para modelar las reglas basicas de un sistema de prestamos.