// начинаем в базу добавлять товары
// импортируем модели
const { Type } = require('../models/models')
// импотируем ApiError для обработки ошибок
const ApiError = require('../error/ApiError')

// логику запросов лучше выносить из router в controller
class TypeController {
    async create(req, res) { // метод создания
        // так как у запроса есть, тело извлекаем его 
        const { name } = req.body
        //и деструктурезируем
        const type = await Type.create({ name }) // с помощью create создаём
        // в данном случае нужно только название передать id присвоется автоматически
        return res.json(type)

    }
    async getAll(req, res) { // метод получения
        // создаём переменную для получения 
        const type = await Type.findAll()
        return res.json(type)
    }
}
module.exports = new TypeController() // создаём объект к которому будим обращаться