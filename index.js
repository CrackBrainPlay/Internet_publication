require('dotenv').config() // что бы наш файл мог считывать конфиг необходимо импортировать

const express = require('express') // экспортируем express

const sequelize = require('./db') // экспортируем файл db

const models = require('./models/models') // импортируем созданные нами модели

//настроим CORS, что бы можно было отправлять запросы с браузера
// для это импортируем функцию CORS
const cors = require('cors')

//импортируем пакет длядобавления фотографий
const fileUpload = require('express-fileupload')

// для того что бы сервер узнал что у нас один корневой Router
const router = require('./routes/index')

// подключаем наш middleWare
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

// импортируем путь до папки со статикой
const path = require('path')

// указываем порт на котором будет запускаться сервер
// но статически порт указывать не совсем корректно по этому выносим в .env
// process.env необходимо для получения PORT из переменного окружения
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors()) // передаём её внутрь app
app.use(express.json()) // передаём express что бы наше приложение могло парсить JSON
app.use(express.static(path.resolve(__dirname, 'static'))) // это необходимо что бы файлы из папки static мы могли раздавать
app.use(fileUpload({})) // подключаем загрузку файлов
app.use('/api', router) // передаёмнаш URI а вторым параметром наш router

//middleWare который идёт с ошибками обязательно долже инди в самом конце
app.use(errorHandler)

// делаем get запрос по URL и callback который принимает параметры requiest и response
//app.get('/', (req, res) => {
//    res.status(200).json({ message: 'WORKING!!!' }) // в фн json передаём тело ответа
//})

// создаём функцию для подключение к базе данных
const start = async () => {
    try {
        await sequelize.authenticate() // вызываем функцию аунтификации
        await sequelize.sync() // будет сверять базу данных со схемой которую мы опишем

        // у app вызываем функцию listen для указания какой порт необходимо прослушивать, 
        //для оповещения что произошёл запуск, а вторым параметром callback для оповещения
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start() // функция для запуска сервера
