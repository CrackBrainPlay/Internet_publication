// импотируем ApiError
const ApiError = require('../error/ApiError')
// импортируем шифрование
const bcrypt = require('bcrypt')
// подключаем jwt
const jwt = require('jsonwebtoken')
// и сам пользователь и данные о корзине
const { User, Basket } = require('../models/models')

// так как нам токен нужно генерировать и в функции логина создадим отдельную функцию
const generateJWT = (id, email, role) => {
    // первым объектом передаёться центральная часть payload
    // вторым параметром передаёться секретный ключ
    // треть это опции основная то сколько живёт токен
    return jwt.sign({ id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' })

}

// логику запросов лучше выносить из router в controller
class UserController {
    async registration(req, res, next) { // метод регистрации
        // получаем данные для регистрации
        const { email, password, role } = req.body
        // делаем проверку присутсвует то или иное поле
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        // делаем проверку, на то сучествует ли такой пользователь
        const candidate = await User.findOne({ where: { email } })
        // сверяем если такой есть кидаем ошибку
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        // если таких ошибок небыло тогда мы можем
        // захешировать пароль и создать нового пользователя
        const hashPassword = await bcrypt.hash(password, 5)
        // с помощью функции create создаём пользователя и передаём туда email
        const user = await User.create({ email, role, password: hashPassword })
        // сразу для пользователя создаём корзину, userId получаем уже у созданного польхователя
        const basket = await Basket.create({ userId: user.id })
        // затем нам нужно сгенерировать jwt token

        const token = generateJWT(user.id, user.email, user.role)

        // после того как токен сгенерирован возвращаем его на клиент
        return res.json({ token })


    }
    async login(req, res, next) { // метод авторизации
        // получаем запрос на авторизацию
        const { email, password } = req.body
        // далее нам надо убедиться что пользователь с такими данными существует
        const user = await User.findOne({ where: { email } })
        // но сдесь в отличие от регистрации проверяем если пользователь не найден
        // возвращаем ошибку
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        // если мы это условие прошли тогда нам надо проверить правильный ли пароль
        // но в базе данных у нас лежит захешированный пароль
        // с помощью compareSync сравниваем пароли
        // первым параметром полученый пароль, а вторым тот который привязан
        // к конкретному user в базе данных
        let comparePassword = bcrypt.compareSync(password, user.password)
        // затем если пароли несовпали возвращаем ошибку
        if (!comparePassword) {
            return next(ApiError.internal('Неверный email или пароль'))
        }
        // если проскачили проверку передаём токен
        const token = generateJWT(user.id, user.email, user.role)
        // и на клиент возвращаем сам токен
        return res.json({ token })
    }

    async check(req, res, next) { // метод проверки авторизирован ли 
        // для реализации проверки нужно создать отдельный middleware
        // в котором мы будем декодировать токен и проверять его на валидность

        //команда для перезаписи токена
        const token = generateJWT(req.user.id, req.user.email, req.user.role)
        // возвращаем сгенерированный токен клиенту
        return res.json(token)

        // res.json({ message: 'all work!' })

        // функция обработки ошибок
        //const { id } = req.query
        //if (!id) {
        //    return next(ApiError.badRequest(' не задан id'))
        //}
        //res.json(id)
    }
}
module.exports = new UserController() // создаём объект к которому будим обращаться