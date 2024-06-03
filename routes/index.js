// каркас приложения, набор маршрутов по которым будут отрабатывать те
// или иные методы
// index связующее звено
const Router = require('express') // получаем роутер из express
const router = new Router() // создаём объект этого Router
const deviceRouter = require('./deviceRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')

// так как остальные будут под типами нужно это указать
router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)

module.exports = router // и экспортируем его