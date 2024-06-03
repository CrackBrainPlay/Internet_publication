// конфигурируем подключение к базе данных


// делаем диструкторизацию, что бы вытащить конретный метод
const { Sequelize } = require('sequelize')

// экспортируем объект который мы создаём из этого класса
// в конструкторе будем указыать пользователя пароль и тд
// необходимо что бы была установлена PostgreSQL password: stas2140 port: 5432
module.exports = new Sequelize(
    process.env.DB_NAME, //название бызы данных
    process.env.DB_USER, // имя пользователя под которым подключаемся
    process.env.DB_PASSWORD, // пароль пользователя
    {
        dialect: 'postgres', // указывает диалект
        host: process.env.DB_HOST, // указываем хост
        port: process.env.DB_PORT // указываем порт
    }
)