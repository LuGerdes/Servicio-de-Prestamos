import { useEffect, useState } from 'react';

function App() {
  const [catalogo, setCatalogo] = useState([]);
  const [misPrestamos, setMisPrestamos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const cargarDatos = () => {
    fetch('http://localhost:3000/api/catalogo')
      .then((res) => res.json())
      .then((data) => setCatalogo(data))
      .catch(() => setMensaje('Error al conectar con el backend'));

    fetch('http://localhost:3000/api/prestamos/2')
      .then((res) => res.json())
      .then((data) => setMisPrestamos(data))
      .catch(() => {});
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const pedirPrestamo = async (itemId) => {
    setMensaje('');
    const res = await fetch('http://localhost:3000/api/prestamos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: 2, itemId }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMensaje(`Error: ${data.error}`);
    } else {
      setMensaje('¡Préstamo registrado con éxito!');
      cargarDatos();
    }
  };

  const devolverPrestamo = async (prestamoId) => {
    setMensaje('');
    const res = await fetch(`http://localhost:3000/api/prestamos/${prestamoId}/devolver`, {
      method: 'POST',
    });
    const data = await res.json();

    if (!res.ok) {
      setMensaje(`Error: ${data.error}`);
    } else {
      setMensaje('¡Ítem devuelto y stock repuesto!');
      cargarDatos();
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Servicio de Préstamos</h1>
      <p>Usuario activo: <strong> (Cliente)</strong></p>

      {mensaje && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#2d3748', color: '#fff', borderRadius: '6px' }}>
          {mensaje}
        </div>
      )}

      <h2>Mis Préstamos Activos ({misPrestamos.length})</h2>
      {misPrestamos.length === 0 ? (
        <p style={{ color: '#888' }}>No tenés préstamos activos en este momento.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
          {misPrestamos.map((p) => (
            <div key={p.id} style={{ border: '1px solid #4a5568', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{p.item.titulo}</strong>
                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
                  Vence: {new Date(p.fechaLimite).toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => devolverPrestamo(p.id)}>
                Devolver
              </button>
            </div>
          ))}
        </div>
      )}

      <h2>Catálogo Disponible</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {catalogo.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{item.titulo}</h3>
            <p>{item.descripcion}</p>
            <p>Stock disponible: <strong>{item.stock}</strong></p>
            <button onClick={() => pedirPrestamo(item.id)} disabled={item.stock === 0}>
              {item.stock > 0 ? 'Solicitar Préstamo' : 'Sin Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;