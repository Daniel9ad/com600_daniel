const { getRepository, getConnection } = require("typeorm");
const { Factura } = require("../entity/Factura");
const { DetalleFactura } = require("../entity/DetalleFactura");
const { Cliente } = require("../entity/Cliente");
const { Producto } = require("../entity/Producto");

// Obtener todas las facturas (con paginación y cliente opcional)
const obtenerFacturas = async (req, res) => {
  try {
    const facturaRepository = getRepository(Factura);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const clienteId = req.query.clienteId;

    const options = {
      skip: skip,
      take: limit,
      relations: ["cliente", "detalles"],
      order: { fecha: "DESC" }
    };

    if (clienteId) {
      options.where = { clienteId: parseInt(clienteId) };
    }

    const [facturas, total] = await facturaRepository.findAndCount(options);

    res.json({
      data: facturas,
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener facturas", error: error.message });
  }
};

// Obtener una factura por ID
const obtenerFactura = async (req, res) => {
  try {
    const facturaRepository = getRepository(Factura);
    const factura = await facturaRepository.findOneBy({id :req.params.id}, {
      relations: ["cliente", "detalles", "detalles.producto"],
    });
    if (factura) {
      res.json(factura);
    } else {
      res.status(404).json({ mensaje: "Factura no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener factura", error: error.message });
  }
};

// Obtener todas las facturas de un cliente específico
const obtenerFacturasPorCliente = async (req, res) => {
  try {
    const clienteId = parseInt(req.params.clienteId);
    if (isNaN(clienteId)) {
      return res.status(400).json({ mensaje: "ID de cliente inválido" });
    }

    // Verificar si el cliente existe
    const clienteRepository = getRepository(Cliente);
    const cliente = await clienteRepository.findOneBy({id: clienteId});
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const facturaRepository = getRepository(Factura);
    const facturas = await facturaRepository.find({
      where: { clienteId: clienteId },
      relations: ["detalles"],
      order: { fecha: "DESC" }
    });

    res.json(facturas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener facturas del cliente", error: error.message });
  }
};


// Crear una nueva factura
const crearFactura = async (req, res) => {
  try {
    const { clienteId, fecha } = req.body;

    if (!clienteId) {
      return res.status(400).json({ mensaje: "El campo clienteId es obligatorio" });
    }

    // Verificar si el cliente existe
    const clienteRepository = getRepository(Cliente);
    const clienteExiste = await clienteRepository.findOneBy({id: clienteId});
    if (!clienteExiste) {
      return res.status(404).json({ mensaje: `Cliente con ID ${clienteId} no encontrado` });
    }

    const facturaRepository = getRepository(Factura);
    const nuevaFacturaData = { clienteId: parseInt(clienteId) };
    if (fecha) {
      nuevaFacturaData.fecha = fecha;
    }

    const nuevaFactura = facturaRepository.create(nuevaFacturaData);
    const resultado = await facturaRepository.save(nuevaFactura);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear factura", error: error.message });
  }
};

// Actualizar información de una factura (ej. fecha)
const editarFactura = async (req, res) => {
  try {
    const facturaId = req.params.id;
    const { fecha, clienteId } = req.body;
    const facturaRepository = getRepository(Factura);
    const factura = await facturaRepository.findOneBy({id: facturaId});

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    if (clienteId) {
      // Verificar si el nuevo cliente existe
      const clienteRepository = getRepository(Cliente);
      const clienteExiste = await clienteRepository.findOneBy({id: clienteId});
      if (!clienteExiste) {
        return res.status(404).json({ mensaje: `Cliente con ID ${clienteId} no encontrado` });
      }
      factura.clienteId = parseInt(clienteId);
    }
    if (fecha) {
      factura.fecha = fecha;
    }

    const resultado = await facturaRepository.save(factura);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar factura", error: error.message });
  }
};

// Eliminar una factura (y sus detalles si cascade está activado)
const eliminarFactura = async (req, res) => {
  try {
    const facturaRepository = getRepository(Factura);
    const factura = await facturaRepository.findOneBy({id: req.params.id});

    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada" });
    }

    const resultado = await facturaRepository.delete(req.params.id);

    if (resultado.affected === 0) {
      return res.status(404).json({ mensaje: "Factura no encontrada (posiblemente eliminada justo antes)" });
    }
    res.status(200).json({ mensaje: "Factura eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar factura", error: error.message });
  }
};


// Añadir un detalle a una factura existente
const agregarDetalleAFactura = async (req, res) => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const facturaId = parseInt(req.params.facturaId);
    const { productoId, cantidad, precio } = req.body;

    if (!productoId || !cantidad || precio === undefined) {
      throw new Error("Los campos productoId, cantidad y precio son obligatorios para el detalle.");
    }

    const facturaRepository = queryRunner.manager.getRepository(Factura);
    const productoRepository = queryRunner.manager.getRepository(Producto);
    const detalleRepository = queryRunner.manager.getRepository(DetalleFactura);

    // 1. Verificar que la factura existe
    const factura = await facturaRepository.findOneBy({id: facturaId});
    if (!factura) {
      throw new Error(`Factura con ID ${facturaId} no encontrada.`);
    }

    // 2. Verificar que el producto existe
    const producto = await productoRepository.findOneBy({id: productoId});
    if (!producto) {
      throw new Error(`Producto con ID ${productoId} no encontrado.`);
    }

    // 3. Verificar stock
    if (producto.stock < cantidad) {
      throw new Error(`Stock insuficiente para el producto ${producto.nombre}. Stock actual: ${producto.stock}`);
    }

    // 4. Crear el nuevo detalle
    const nuevoDetalle = detalleRepository.create({
      facturaId: facturaId,
      productoId: parseInt(productoId),
      cantidad: parseInt(cantidad),
      precio: parseFloat(precio),
    });
    const detalleGuardado = await detalleRepository.save(nuevoDetalle);

    // 5. Actualizar el stock del producto
    producto.stock -= parseInt(cantidad);
    await productoRepository.save(producto);

    // confirmar la transacción
    await queryRunner.commitTransaction();

    res.status(201).json(detalleGuardado);

  } catch (error) {
    // Si algo falló, deshacer la transacción
    await queryRunner.rollbackTransaction();
    const status = error.message.includes("no encontrada") ? 404 : (error.message.includes("insuficiente") ? 400 : 500);
    res.status(status).json({ mensaje: "Error al agregar detalle a la factura", error: error.message });
  } finally {
    await queryRunner.release();
  }
};


// Obtener todos los detalles de una factura específica
const obtenerDetallesDeFactura = async (req, res) => {
  try {
    const facturaId = parseInt(req.params.facturaId);

    // Verificar si la factura existe primero
    const facturaRepository = getRepository(Factura);
    const facturaExiste = await facturaRepository.findOneBy({id: facturaId});
    if (!facturaExiste) {
      return res.status(404).json({ mensaje: `Factura con ID ${facturaId} no encontrada` });
    }

    const detalleRepository = getRepository(DetalleFactura);
    const detalles = await detalleRepository.find({
      where: { facturaId: facturaId },
      relations: ["producto"], // Cargar la información del producto asociado
    });
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener detalles de la factura", error: error.message });
  }
};

// Actualizar un detalle específico de una factura
const actualizarDetalleFactura = async (req, res) => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const facturaId = parseInt(req.params.facturaId); // El ID de la factura viene en la URL
    const detalleId = parseInt(req.params.detalleId);
    const { cantidad, precio, productoId } = req.body; // Campos que se pueden actualizar

    const detalleRepository = queryRunner.manager.getRepository(DetalleFactura);
    const productoRepository = queryRunner.manager.getRepository(Producto);

    // 1. Buscar el detalle existente asegurándose que pertenece a la factura correcta
    const detalle = await detalleRepository.findOne({ where: { id: detalleId, facturaId: facturaId }, relations: ["producto"] });
    if (!detalle) {
      throw new Error(`Detalle con ID ${detalleId} no encontrado en la factura ${facturaId}.`);
    }

    const cantidadOriginal = detalle.cantidad;
    const productoOriginalId = detalle.productoId;

    // 2. Validar campos y actualizar el detalle
    let stockDifference = 0;
    let productoNuevo = null;

    if (productoId && productoId !== detalle.productoId) {
      // Si cambia el producto, verificar que el nuevo producto existe
      productoNuevo = await productoRepository.findOne(productoId);
      if (!productoNuevo) {
        throw new Error(`Producto con ID ${productoId} no encontrado.`);
      }
      // Verificar stock del *nuevo* producto si la cantidad también cambia o es diferente de cero
      const cantidadAUsar = cantidad !== undefined ? parseInt(cantidad) : detalle.cantidad;
      if (productoNuevo.stock < cantidadAUsar) {
        throw new Error(`Stock insuficiente para el nuevo producto ${productoNuevo.nombre}. Stock actual: ${productoNuevo.stock}`);
      }
      // Devolver stock al producto original
      const productoOriginal = await productoRepository.findOne(productoOriginalId);
      if (productoOriginal) {
        productoOriginal.stock += cantidadOriginal;
        await productoRepository.save(productoOriginal);
      }
      detalle.productoId = parseInt(productoId);
      detalle.producto = productoNuevo; // Actualizar la relación cargada
      stockDifference = - (cantidad !== undefined ? parseInt(cantidad) : detalle.cantidad); // Restar stock del nuevo producto
    }

    if (cantidad !== undefined) {
      const nuevaCantidad = parseInt(cantidad);
      if (isNaN(nuevaCantidad) || nuevaCantidad < 0) { // Podría ser 0 si se quiere eliminar lógicamente?
        throw new Error("La cantidad debe ser un número positivo.");
      }
      // Calcular diferencia de stock solo si el producto no cambió (si cambió, ya se calculó arriba)
      if (!productoNuevo) {
        stockDifference = cantidadOriginal - nuevaCantidad; // Positivo si se reduce cantidad, negativo si aumenta
        const productoActual = detalle.producto;
        if (productoActual.stock + stockDifference < 0) { // Verificar si hay suficiente stock para el *aumento*
          throw new Error(`Stock insuficiente para aumentar la cantidad del producto ${productoActual.nombre}. Stock actual: ${productoActual.stock}, Necesario adicional: ${-stockDifference}`);
        }
      }
      detalle.cantidad = nuevaCantidad;
    }

    if (precio !== undefined) {
      const nuevoPrecio = parseFloat(precio);
      if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
        throw new Error("El precio debe ser un número positivo.");
      }
      detalle.precio = nuevoPrecio;
    }

    // 3. Guardar el detalle actualizado
    const resultado = await detalleRepository.save(detalle);

    // 4. Actualizar el stock del producto afectado (si cambió cantidad o producto)
    if (stockDifference !== 0) {
      const productoAfectadoRepo = queryRunner.manager.getRepository(Producto);
      const productoAfectado = await productoAfectadoRepo.findOne(detalle.productoId);
      if (productoAfectado) {
        productoAfectado.stock += stockDifference;
        await productoAfectadoRepo.save(productoAfectado);
      }
    }

    await queryRunner.commitTransaction();
    res.json(resultado);

  } catch (error) {
    await queryRunner.rollbackTransaction();
    const status = error.message.includes("no encontrado") ? 404 : (error.message.includes("insuficiente") || error.message.includes("inválido") ? 400 : 500);
    res.status(status).json({ mensaje: "Error al actualizar detalle de la factura", error: error.message });
  } finally {
    await queryRunner.release();
  }
};


// Eliminar un detalle específico de una factura
const eliminarDetalleFactura = async (req, res) => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const facturaId = parseInt(req.params.facturaId);
    const detalleId = parseInt(req.params.detalleId);

    const detalleRepository = queryRunner.manager.getRepository(DetalleFactura);

    // 1. Buscar el detalle para obtener productoId y cantidad antes de borrar
    const detalle = await detalleRepository.findOne({ where: { id: detalleId, facturaId: facturaId } });
    if (!detalle) {
      throw new Error(`Detalle con ID ${detalleId} no encontrado en la factura ${facturaId}.`);
    }
    const { productoId, cantidad } = detalle;


    // 2. Eliminar el detalle
    const resultado = await detalleRepository.delete({ id: detalleId, facturaId: facturaId }); // Asegura que borramos el correcto

    if (resultado.affected === 0) {
      // No debería pasar si findOne lo encontró, pero por si acaso
      throw new Error(`Detalle con ID ${detalleId} no encontrado en la factura ${facturaId} al intentar borrar.`);
    }

    // 3. (Opcional pero recomendado) Devolver el stock al producto
    const productoRepository = queryRunner.manager.getRepository(Producto);
    const producto = await productoRepository.findOneBy({id: productoId});
    if (producto) {
      producto.stock += cantidad;
      await productoRepository.save(producto);
    }

    await queryRunner.commitTransaction();
    res.status(200).json({ mensaje: "Detalle de factura eliminado correctamente" });

  } catch (error) {
    await queryRunner.rollbackTransaction();
    const status = error.message.includes("no encontrado") ? 404 : 500;
    res.status(status).json({ mensaje: "Error al eliminar detalle de la factura", error: error.message });
  } finally {
    await queryRunner.release();
  }
};


module.exports = {
  // Facturas
  obtenerFacturas,
  obtenerFactura,
  obtenerFacturasPorCliente,
  crearFactura,
  editarFactura,
  eliminarFactura,
  // Detalles (manejados desde el contexto de una factura)
  agregarDetalleAFactura,
  obtenerDetallesDeFactura,
  actualizarDetalleFactura,
  eliminarDetalleFactura,
};