# Decisiones de diseño y calidad del sistema de préstamos

## 1. ¿Qué partes revisamos?

Revisamos los modelos, los servicios, los puntos de entrada del programa y las pruebas automatizadas del backend. El sistema permite registrar usuarios, cargar libros y juegos de mesa, solicitar préstamos y registrar devoluciones.

## 2. ¿Cómo está organizado el código?

- `Usuario`: guarda los datos del usuario y permite saber si tiene rol de administrador (`admin`) o cliente (`cliente`).
- `Item`: guarda los datos comunes de los ítems y permite revisar, descontar y reponer el stock.
- `Libro` y `JuegoDeMesa`: heredan de `Item`. El plazo de préstamo es de 15 días para un libro y de 5 días para un juego.
- `Prestamo`: guarda los datos del préstamo, calcula la fecha límite y registra la devolución. Al devolver un ítem, también repone su stock.
- `CatalogoService`: administra los ítems. Solo un administrador puede agregar ítems y no permite repetir sus IDs.
- `UsuarioService`: registra, busca y elimina usuarios. Solo un administrador puede listar o eliminar usuarios.
- `PrestamoService`: valida las reglas de negocio de los préstamos (usuario válido, rol cliente, sin préstamos duplicados del mismo ítem, tope de 3 préstamos activos y stock disponible), controla el inventario y permite consultar préstamos según el rol del usuario.

## 3. ¿Por qué usamos `ItemFactory`?

- **Diagnóstico:** `CatalogoService` necesitaba instanciar distintos tipos de ítems (`Libro` o `JuegoDeMesa`) a partir de un parámetro de tipo, lo que generaba acoplamiento directo del servicio con las clases concretas.
- **Alternativas evaluadas:**
  - *Conservar lo actual:* Dejar condicionales `if/else` directos dentro de `CatalogoService`. Se descartó para no mezclar la lógica de gestión del catálogo con los detalles de instanciación.
  - *Patrón Builder:* Se descartó porque los ítems tienen atributos simples y no requieren una construcción compleja paso a paso.
  - *Patrón Factory (`ItemFactory`):* Opción elegida.
- **Decisión:** `ItemFactory` centraliza la creación de libros y juegos de mesa según el tipo recibido (`libro`, `juego` o `juegodemesa`). Si recibe otro tipo, lanza un error controlado. Si más adelante agregamos otro tipo de ítem, solo habrá que crear su clase y actualizar la Factory.

## 4. Otras decisiones de diseño y alternativas descartadas

- **No usamos Singleton:** Aunque `backend/src/index.js` y `backend/src/server.js` crean una instancia de cada servicio, las clases no restringen la creación de nuevas instancias. Esto facilita aislar cada caso de prueba en Jest sin arrastrar estado global entre tests.
- **No usamos un repositorio compartido ni inyección de dependencias compleja entre servicios:** Cada servicio administra su propia colección en memoria. `PrestamoService` recibe directamente las instancias de `usuario` e `item` al solicitar un préstamo.
- **Reglas de negocio en `PrestamoService`:** Evaluamos mantener una versión inicial con validaciones básicas frente a incorporar restricciones reales del dominio. Decidimos agregar el límite máximo de 3 préstamos activos en simultáneo y el bloqueo de préstamos duplicados de un mismo ítem para evitar inconsistencias de negocio.
- **No agregamos otros patrones** como Builder, Adapter, Facade, Decorator, Strategy, Observer o Command. Con el alcance actual, las reglas se resuelven de forma clara con los modelos y servicios existentes sin introducir capas innecesarias.

## 5. Flujo de solicitud y devolución de un préstamo

1. Al solicitar un préstamo, `PrestamoService.solicitarPrestamo(usuario, item)` verifica que exista un usuario, que no sea administrador, que no tenga ya un préstamo activo de ese mismo ítem, que no supere el límite de 3 préstamos activos y que el ítem tenga stock disponible. Si todas las condiciones se cumplen, descuenta una unidad del stock y registra el `Prestamo`.
2. Al devolverlo, `PrestamoService.registrarDevolucion(idPrestamo)` busca el préstamo y comprueba que siga activo. Luego `Prestamo.registrarDevolucion()` marca el estado como devuelto, registra la fecha y repone una unidad al stock del ítem.

## 6. Ventajas y trade-offs

| Decisión | Beneficio | Costo / Trade-off |
| --- | --- | --- |
| Usar `ItemFactory` | Centraliza la creación de libros y juegos en un único punto y desacopla `CatalogoService`. | Para agregar un nuevo tipo de ítem hay que modificar la Factory. |
| Guardar los datos en memoria | El sistema es simple, rápido de levantar y permite ejecutar pruebas unitarias aisladas con estado limpio. | Al reiniciar el proceso, los datos en memoria se pierden. |
| Mantener el diseño simple sin patrones extra | Evita sobreingeniería y facilita la lectura del código. | Si las reglas de negocio o variantes de cálculo crecen mucho, habrá que refactorizar (por ejemplo, hacia Strategy). |

## 7. Archivos de referencia en el repositorio

- `backend/src/models/ItemFactory.js`: creación centralizada de libros y juegos de mesa.
- `backend/src/models/items.js`: comportamiento común de los ítems y control de stock.
- `backend/src/models/prestamo.js`: cálculo de vencimientos y registro de devoluciones.
- `backend/src/services/catalogoService.js`: administración del catálogo y validación de permisos de administrador.
- `backend/src/services/prestamoService.js`: validaciones de dominio y gestión de préstamos y devoluciones.
- `backend/src/services/usuarioService.js`: gestión de usuarios.
- `backend/src/index.js` y `backend/src/server.js`: inicialización de servicios y puntos de entrada.
- `backend/src/tests/CatalogoService.test.js` y `backend/src/tests/PrestamoService.test.js`: pruebas unitarias automatizadas.

## 8. Calidad de código, testing y automatización 

- **Análisis estático con ESLint:** Se configuró ESLint en `eslint.config.mjs` (en la raíz del repositorio) diferenciando las reglas globales de Node.js para el código fuente y las de Jest para `backend/src/tests/**/*.js`. Al ejecutarlo, se detectó y eliminó código muerto (una importación sin uso de `Usuario` en `backend/src/services/usuarioService.js`).
- **Testing automatizado basado en riesgo:** Se implementaron pruebas unitarias con Jest sobre los servicios críticos del negocio (`CatalogoService` y `PrestamoService`), cubriendo casos normales, casos límite (dejar stock en 0 tras prestar la última unidad) y casos de error (rechazar préstamos sin stock, bloquear préstamos a administradores e impedir que un cliente modifique el catálogo).
- **Automatización de tareas:** En `package.json` se centralizaron los comandos repetitivos (`npm start`, `npm test`, `npm run lint` y `npm run check`, que ejecuta ESLint y Jest de forma encadenada) para estandarizar la verificación de calidad antes de integrar cambios.