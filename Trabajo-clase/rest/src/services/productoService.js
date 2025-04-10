const { getRepository } = require("typeorm");
const { Producto } = require("../entity/Producto");

// Obtener todos los productos con paginación y filtrado
const obtenerProductos = async (req, res) => {
  try {
    const productoRepository = getRepository(Producto);

    // Obtener parámetros de la query string (con valores por defecto)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const nombre = req.query.nombre;
    const descripcion = req.query.descripcion;
    const marca = req.query.marca;

    // Calcular offset
    const skip = (page - 1) * limit;

    // Construir la consulta con filtros
    const query = productoRepository.createQueryBuilder("producto")
      .skip(skip)
      .take(limit);

    // Aplicar filtros si existen
    if (nombre) {
      query.andWhere("producto.nombre LIKE :nombre", { nombre: `%${nombre}%` });
    }
    if (descripcion) {
      query.andWhere("producto.descripcion LIKE :descripcion", { descripcion: `%${descripcion}%` });
    }
    if (marca) {
      query.andWhere("producto.marca LIKE :marca", { marca: `%${marca}%` });
    }

    // Ejecutar la consulta y obtener resultados
    const [productos, total] = await query.getManyAndCount();

    const response = {
      data: productos,
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
};

// Obtener un producto
const obtenerProducto = async (req, res) => {
  try {
    const producto = await getRepository(Producto).findOneBy({ id: req.params.id });
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ mensaje: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
  }
};

// Crear un nuevo productos
const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    if (!nombre || !descripcion || !marca || !stock) {
      return res.status(400).json({ mensaje: "Los campos nombre, descripcion, stock y apellidos son obligatorios" });
    }
    const nuevoProducto = getRepository(Producto).create({
      nombre,
      descripcion,
      marca,
      stock,
    });
    const resultado = await getRepository(Producto).save(nuevoProducto);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

// Actualizar un producto
const editarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, stock } = req.body;
    const producto = await getRepository(Producto).findOneBy({ id: req.params.id });
    if (producto) {
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.marca = marca;
      producto.stock = stock;
      const resultado = await getRepository(Producto).save(producto);
      res.json(resultado);
    } else {
      res.status(404).json({ mensaje: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const productoRepository = getRepository(Producto);
    const producto = await productoRepository.findOneBy({ id: req.params.id });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const resultado = await productoRepository.delete(req.params.id);
    if (resultado.affected === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado (posiblemente eliminado justo antes)" });
    }
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar Producto", error: error.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
