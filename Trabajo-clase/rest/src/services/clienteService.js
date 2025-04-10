const { getRepository } = require("typeorm");
const { Cliente } = require("../entity/Cliente");

// Obtener todos los clientes (con paginación opcional)
const obtenerClientes = async (req, res) => {
  try {
    const clienteRepository = getRepository(Cliente);
    
    // Obtener parámetros de la query string (con valores por defecto)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const ci = req.query.ci;
    const nombres = req.query.nombres;
    const apellidos = req.query.apellidos;
    
    // Calcular offset
    const skip = (page - 1) * limit;

    // Construir la consulta con filtros
    const query = clienteRepository.createQueryBuilder("cliente")
      .skip(skip)
      .take(limit);

    // Aplicar filtros si existen
    if (ci) {
      query.andWhere("producto.ci LIKE :ci", { ci: `%${ci}%` });
    }
    if (nombres) {
      query.andWhere("producto.nombres LIKE :nombres", { nombres: `%${nombres}%` });
    }
    if (apellidos) {
      query.andWhere("producto.apellidos LIKE :apellidos", { apellidos: `%${apellidos}%` });
    }

    // Ejecutar la consulta y obtener resultados
    const [clientes, total] = await query.getManyAndCount();

    const response = {
      data: clientes,
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error: error.message });
  }
};

// Obtener un cliente por ID
const obtenerCliente = async (req, res) => {
  try {
    const clienteRepository = getRepository(Cliente);
    const cliente = await clienteRepository.findOneBy({id: req.params.id});
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ mensaje: "Error al obtener cliente", error: error.message });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const { ci, nombres, apellidos, sexo } = req.body;
    if (!ci || !nombres || !apellidos) {
      return res.status(400).json({ mensaje: "Los campos ci, nombres y apellidos son obligatorios" });
    }
    const clienteRepository = getRepository(Cliente);
    const nuevoCliente = clienteRepository.create({ ci, nombres, apellidos, sexo });
    const resultado = await clienteRepository.save(nuevoCliente);
    res.status(201).json(resultado); 
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear cliente", error: error.message });
  }
};

// Actualizar un cliente
const editarCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const { ci, nombres, apellidos, sexo } = req.body;
    const clienteRepository = getRepository(Cliente);
    const cliente = await clienteRepository.findOneBy({id: clienteId});

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    // Validar si se intenta cambiar la CI a una que ya existe por otro cliente
    if (ci && ci !== cliente.ci) {
        const existe = await clienteRepository.findOne({ where: { ci } });
        if (existe) {
            return res.status(400).json({ mensaje: `La CI ${ci} ya está asignada a otro cliente` });
        }
        cliente.ci = ci;
    }

    // Actualizar los campos proporcionados
    if (nombres) cliente.nombres = nombres;
    if (apellidos) cliente.apellidos = apellidos;
    if (sexo !== undefined) cliente.sexo = sexo;

    const resultado = await clienteRepository.save(cliente);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar cliente", error: error.message });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const clienteRepository = getRepository(Cliente);
    const cliente = await clienteRepository.findOneBy({id: req.params.id});

    if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const resultado = await clienteRepository.delete(req.params.id);
    if (resultado.affected === 0) {
        return res.status(404).json({ mensaje: "Cliente no encontrado (posiblemente eliminado justo antes)" });
    }
    res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error: error.message });
  }
};

module.exports = {
  obtenerClientes,
  obtenerCliente,
  crearCliente,
  editarCliente,
  eliminarCliente,
};