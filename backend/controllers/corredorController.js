const { Corredor } = require('../models');

const getAllCorredores = async (req, res) => {
    try {
        const corredores = await Corredor.findAll(); // Obtiene todos los corredores
        return res.status(200).json(corredores);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllCorredores };
