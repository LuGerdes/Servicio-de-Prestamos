# Decisiones de diseño del sistema de préstamos

## 1. ¿Qué partes revisamos?

Revisamos los modelos, los servicios, el inicio del programa y las pruebas. El sistema permite registrar usuarios, cargar libros y juegos de mesa, solicitar préstamos y registrar devoluciones.

## 2. ¿Cómo está organizado el código?

- `Usuario` guarda los datos del usuario y permite saber si es administrador o cliente.
- `Item` guarda los datos comunes de los ítems y permite revisar, descontar y reponer el stock.
- `Libro` y `JuegoDeMesa` heredan de `Item`. El plazo de préstamo es de 15 días para un libro y de 5 días para un juego.
- `Prestamo` guarda los datos del préstamo, calcula la fecha límite y registra la devolución. Al devolver un ítem, también repone su stock.
- `CatalogoService` administra los ítems. Solo un administrador puede agregar ítems y no permite repetir sus IDs.
- `UsuarioService` registra, busca y elimina usuarios. Solo un administrador puede listar o eliminar usuarios.
- `PrestamoService` valida los préstamos, controla el stock y permite consultar préstamos según el rol del usuario.

## 3. ¿Por qué usamos `ItemFactory`?

`ItemFactory` crea libros y juegos de mesa según el tipo recibido. Así, `CatalogoService` no tiene que decidir por su cuenta qué clase crear.

La Factory acepta los tipos `libro`, `juego` y `juegodemesa`. Si recibe otro tipo, muestra un error. Si más adelante agregamos otro tipo de ítem, habrá que agregar su clase y modificar la Factory.

## 4. ¿Qué decisiones tomamos?

- **Usamos una Factory para crear los ítems.** Mantiene esa decisión en un solo lugar.
- **No usamos Singleton.** Aunque `src/index.js` crea una instancia de cada servicio, el programa no impide que se creen otras.
- **No usamos un repositorio compartido ni inyección de dependencias entre servicios.** Cada servicio guarda su propia información en memoria. El servicio de préstamos recibe directamente el usuario y el ítem al crear un préstamo.
- **No agregamos otros patrones** como Builder, Adapter, Facade, Decorator, Strategy, Observer o Command. Por ahora, las reglas del sistema se resuelven directamente en los modelos y servicios.

## 5. ¿Qué pasa cuando se solicita y se devuelve un préstamo?

Al solicitar un préstamo, `PrestamoService` revisa que haya un usuario, que no sea administrador y que el ítem tenga stock. Si la solicitud es válida, descuenta una unidad y crea el préstamo.

Al devolverlo, el servicio busca el préstamo y comprueba que todavía esté activo. Después, `Prestamo` marca la devolución, guarda la fecha y repone una unidad al stock.

## 6. Ventajas y límites

| Decisión | Ventaja | Límite |
| --- | --- | --- |
| Usar `ItemFactory` | La creación de libros y juegos está en un solo lugar. | Para agregar otro tipo de ítem hay que modificar la Factory. |
| Guardar los datos en memoria | El sistema es sencillo y las pruebas pueden empezar con datos limpios. | Al cerrar el programa, los datos se pierden. |
| Resolver las reglas con los servicios y modelos actuales | No se agregan piezas que el sistema todavía no necesita. | Si las reglas crecen, habrá que revisar si conviene cambiar el diseño. |

## 7. Archivos que muestran estas decisiones

- `src/models/ItemFactory.js`: crea libros y juegos de mesa.
- `src/models/items.js`: contiene el comportamiento común de los ítems y el stock.
- `src/models/prestamo.js`: calcula fechas y registra devoluciones.
- `src/services/catalogoService.js`: administra el catálogo.
- `src/services/prestamoService.js`: administra los préstamos.
- `src/services/usuarioService.js`: administra los usuarios.
- `src/index.js`: crea los servicios y ejecuta una demostración.
- `src/tests/`: contiene pruebas de catálogo y préstamos.
