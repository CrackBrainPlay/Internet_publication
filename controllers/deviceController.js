// логику запросов лучше выносить из router в controller

// импортируем генератор id
const uuid = require('uuid')

// модуль nodejs для адаптации путей к файлам
const path = require('path')

// подключаем модель для создания обязательно в {}
// для работы и информацией о девайсе и info, нужно импортировать DeviceInfo
const { Device, DeviceInfo } = require('../models/models')
// подключаем обаботчик ошибок
const ApiError = require('../error/ApiError')


class DeviceController {
    async create(req, res, next) { // метод создания
        try {
            // поле info указываем в models
            let { name, price, brandId, typeId, info } = req.body // получаем информацию
            const { img } = req.files // получаем файл
            let fileName = uuid.v4() + ".jpg"  // генерируем название и добавляем расширение
            // первый параметр это путь до текущей папки с контроллерами
            // затем указываем .. что бы вернуться на директорию назад
            // затем папку static
            // таким образом мы перемещаем файлы сразу в нужную папку
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            // вызываем функцию в которую передаём все параметры
            // для файла мы передаём только его имя, а не сам файл
            const device = await Device.create({ name, price, brandId, typeId, info, img: fileName })

            // задаём условие проверки наличия info
            if (info) {
                //когда у нас данные приходять через formData
                // они приходят в виде строки и их нужно парсить
                // на фронте в json строку
                info = JSON.parse(info)
                // после того как распарсили, нужно по масиву пройтись
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: i.id
                    })
                )
                // а на беке опять в js объекты
            }


            // после того как товар создан возвращаем о нём информацию на клиент
            return res.json(device)
        } catch (e) {
            // используем try для перехвата ошибки и с помощью операции next продалжаем работу и выдаёмошибку
            next(ApiError.badRequest(e.message))
        }

    }
    async getAll(req, res) { // метод получения
        // будем получать branId и typeId из строки запроса query
        // когда много девайсов нужно добавить доп параметры
        // limit -это кол-во девайсов на 1 стр
        // 
        let { brandId, typeId, limit, page } = req.query
        page = page || 1 // если страница не указана то 1
        limit = limit || 9 // если кол-во не указано то 9
        // теперь считаем отступ
        let offset = page * limit - limit // добавляем отступ
        // если они не указаны возвращаем все
        let device;
        // делаем проверки
        if (!brandId && !typeId) { // нету 1-ог и 2-го
            // что бы была возможность получить колво на front
            // вместо findAll нужно использовать findAndCountAll
            device = await Device.findAndCountAll({ limit, offset }) // делаем запрос к базе данных и запросим все девайсы
        }
        if (brandId && !typeId) {// есть 1-ый и нету 2-го
            // делаем запрос к базе данных но тут у нас уже есть brandId и его передаём в запросе
            device = await Device.findAndCountAll({ where: { brandId }, limit, offset })
        }
        if (!brandId && typeId) {// нету 1-го и есть 2-ой
            device = await Device.findAndCountAll({ where: { typeId }, limit, offset })
        }
        if (brandId && typeId) {// есть 1-ый и  есть 2-ой
            device = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset })
        }
        return res.json(device) // на выходе будем возвращать массив девайсов

    }

    async getOne(req, res) { // метод получения
        // в первую очередь получаем id устройства, мы его указывали в router
        const { id } = req.params
        // далее вызываемфункцию findOne
        const device = await Device.findOne(
            {
                where: { id },  // указываем условие для поиска
                include: [{ model: DeviceInfo, as: 'info' }] // сразу подгружаем параметры товара
            }
        )
        return res.json(device) // возвращаем этот девайс на клиент
    }
}
module.exports = new DeviceController() // создаём объект к которому будим обращаться