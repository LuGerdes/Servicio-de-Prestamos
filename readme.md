# Sistema de Préstamos de Libros y Juegos de Mesa

Aplicación web full-stack desarrollada con Node.js, Express y React para administrar usuarios, un catálogo de libros y juegos de mesa, y los préstamos de esos ítems. El sistema aplica reglas de negocio según el rol del usuario, controla el stock disponible, calcula fechas límite y repone las unidades al registrar una devolución.

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

Los datos se mantienen en memoria durante la ejecución del servidor; actualmente el proyecto no utiliza una base de datos externa.

## Tecnologías y requisitos

- **Backend:** Node.js (versión LTS recomendada) y Express.
- **Frontend:** React y Vite.
- **Calidad y pruebas:** Jest y ESLint.
- **Herramientas:** npm y Git.

Verifica las instalaciones de Node y npm con:

```bash
node --version
npm --version