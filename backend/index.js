const dotenv = require('dotenv');

// Cargar el archivo .env adecuado según el entorno (dev, prod, test)
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database'); // Importa la instancia
const redisClient = require('./config/redis');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
// const sequelizeRoutes = require('./routes/sequelizeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());  // Asegúrate de agregar esta línea

// Rutas
const corredoresRoutes = require('./routes/corredores');
app.use('/corredores', corredoresRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
// app.use('/api', sequelizeRoutes);

// Conexión a la base de datos
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Conexión a la base de datos establecida correctamente.');

//     if (process.env.NODE_ENV !== 'production') {
//       await sequelize.sync({ alter: true }); // Ajusta las tablas sin borrar datos
//       console.log('Base de datos sincronizada.');
//     }
//   } catch (error) {
//     console.error('Error al conectar con la base de datos:', error);
//   }
// })();


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
