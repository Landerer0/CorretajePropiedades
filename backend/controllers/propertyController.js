const { Propiedad, Imagen, Corredor } = require('../models');
const sequelize = require('../config/database'); // Asegúrate de importar tu instancia de Sequelize


const getProperty = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la propiedad por ID, incluyendo imágenes y corredor asociado
        const propiedad = await Propiedad.findOne({
            where: { id },
            include: [
                {
                    model: Imagen,
                    as: 'imagenes', // Alias definido en la relación
                },
                {
                    model: Corredor,
                    as: 'corredor', // Alias definido en la relación
                    attributes: ['id', 'name', 'email', 'phone'], // Seleccionar campos del corredor
                },
            ],
        });

        // Si no se encuentra la propiedad
        if (!propiedad) {
            return res.status(404).json({ error: 'Propiedad no encontrada.' });
        }

        // Enviar la propiedad encontrada SIN la clave "propiedad"
        return res.status(200).json(propiedad); // <-- Quita el objeto que envuelve
        // // Enviar la propiedad encontrada
        // return res.status(200).json({ propiedad });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createProperty = async (req, res) => {
    const transaction = await sequelize.transaction(); // Inicia una transacción
    try {
        console.log("createProperty: Inicio de transacción");
        // Subir imagen
        const { location } = req.file; // URL pública de la imagen en S3
        const { descripcion, precio, direccion, corredorId } = req.body;

        // Validar datos obligatorios
        if (!descripcion || !precio || !direccion || !corredorId) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }
        console.log("createProperty: Fin de Validación de datos");

        // Crear la propiedad
        const nuevaPropiedad = await Propiedad.create(
            {
                descripcion,
                precio,
                direccion,
                corredorId,
            },
            { transaction }
        );
        
        console.log("createProperty: Fin creacion de la propiedad");

        // Crear el registro de la imagen asociada
        const nuevaImagen = await Imagen.create(
            {
                url: location,
                propiedadId: nuevaPropiedad.id,
            },
            { transaction }
        );

        console.log("createProperty: Fin creacion de la imagen");

        // Confirmar la transacción
        await transaction.commit();

        console.log("createProperty: Fin de la transaccion");

        return res.status(201).json({
            message: 'Propiedad creada exitosamente.',
            propiedad: {
                id: nuevaPropiedad.id,
                descripcion: nuevaPropiedad.descripcion,
                precio: nuevaPropiedad.precio,
                direccion: nuevaPropiedad.direccion,
                corredorId: nuevaPropiedad.corredorId,
                imagenes: [
                    {
                        id: nuevaImagen.id,
                        url: nuevaImagen.url,
                    },
                ],
            },
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getProperty, createProperty };
