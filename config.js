require('dotenv').config();

module.exports = {
    //Database connection information
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT ,    

    //Setting port for server
    PORT: process.env.PORT || 3000,

    //JWT secret key
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_SECRET_EXPIRES: process.env.JWT_SECRET_EXPIRES,

    //Setting email credentials
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
}