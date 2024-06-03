const Router = require('express') // получаем роутер из express
const router = new Router() // создаём объект этого Router
// необходимо указать функции которые будут отрабатывать при том или ином маршруте
const deviceController = require('../controllers/deviceController')
// добавляем middleware на проверку роли
const checkRole = require('../middleware/checkRoleMiddleware')

// методы для работы с девайсами
router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.delete('/',)

module.exports = router