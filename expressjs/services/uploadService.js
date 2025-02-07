const s3 = require('../config/aws');

const uploadImage = async (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `properties/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const result = await s3.upload(params).promise();
    return result.Location; // URL de la imagen
};

module.exports = { uploadImage };