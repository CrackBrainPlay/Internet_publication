// логику запросов лучше выносить из router в controller
// импортируем модели
const { Brand } = require('../models/models')
// импотируем ApiError
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res) { // метод создания
        // так как у запроса есть, тело извлекаем его 
        const { name } = req.body
        //и деструктурезируем
        const brand = await Brand.create({ name }) // с помощью create создаём
        // в данном случае нужно только название передать id присвоется автоматически
        return res.json(brand)

    }
    async getAll(req, res) { // метод получения
        const brands = await Brand.findAll();
        return res.json(brands)
    }
}
module.exports = new BrandController() // создаём объект к которому будим обращаться