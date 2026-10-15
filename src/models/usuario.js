class usuario {
  constructor(id, nombre, email, rol = 'cliente') {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol; 
  }
  esAdmin() {
    return this.rol === 'admin';
  }

  esCliente() {
    return this.rol === 'cliente';
  }
}

module.exports = usuario;