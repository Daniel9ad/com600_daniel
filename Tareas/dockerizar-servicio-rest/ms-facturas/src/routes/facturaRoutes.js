const express = require("express");
const router = express.Router();
const service = require("../services/facturaService");

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtiene todas las facturas
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   clienteId:
 *                     type: string
 *                   total:
 *                     type: number
 */
router.get("/", service.obtenerFacturas);

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Obtiene una factura por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 clienteId:
 *                   type: string
 *                 total:
 *                   type: number
 *       404:
 *         description: Factura no encontrada
 */
router.get("/:id", service.obtenerFactura);

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Crea una nueva factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Factura creada
 */
router.post("/", service.crearFactura);

/**
 * @swagger
 * /facturas/{id}:
 *   put:
 *     summary: Actualiza una factura existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Factura actualizada
 */
router.put("/:id", service.editarFactura);

/**
 * @swagger
 * /facturas/{id}:
 *   delete:
 *     summary: Elimina una factura
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Factura eliminada
 */
router.delete("/:id", service.eliminarFactura);

/**
 * @swagger
 * /facturas/cliente/{clienteId}:
 *   get:
 *     summary: Obtiene todas las facturas de un cliente
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de facturas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   total:
 *                     type: number
 */
router.get("/cliente/:clienteId", service.obtenerFacturasPorCliente);

/**
 * @swagger
 * /facturas/{facturaId}/detalles:
 *   post:
 *     summary: Agrega un detalle a una factura
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *               cantidad:
 *                 type: number
 *     responses:
 *       201:
 *         description: Detalle agregado
 */
router.post("/:facturaId/detalles", service.agregarDetalleAFactura);

/**
 * @swagger
 * /facturas/{facturaId}/detalles:
 *   get:
 *     summary: Obtiene los detalles de una factura
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Lista de detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   productoId:
 *                     type: string
 *                   cantidad:
 *                     type: number
 */
router.get("/:facturaId/detalles", service.obtenerDetallesDeFactura);

/**
 * @swagger
 * /facturas/{facturaId}/detalles/{detalleId}:
 *   put:
 *     summary: Actualiza un detalle de una factura
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *       - in: path
 *         name: detalleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: number
 *     responses:
 *       200:
 *         description: Detalle actualizado
 */
router.put("/:facturaId/detalles/:detalleId", service.actualizarDetalleFactura);

/**
 * @swagger
 * /facturas/{facturaId}/detalles/{detalleId}:
 *   delete:
 *     summary: Elimina un detalle de una factura
 *     parameters:
 *       - in: path
 *         name: facturaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la factura
 *       - in: path
 *         name: detalleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del detalle
 *     responses:
 *       204:
 *         description: Detalle eliminado
 */
router.delete("/:facturaId/detalles/:detalleId", service.eliminarDetalleFactura);

module.exports = router;