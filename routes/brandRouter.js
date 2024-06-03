const Router = require('express') // получаем роутер из express
const router = new Router() // создаём объект этого Router
// необходимо указать функции которые будут отрабатывать при том или ином маршруте
const brandController = require('../controllers/brandController')
// добавляем middleware на проверку роли
const checkRole = require('../middleware/checkRoleMiddleware')


// методы для работы с брендами
router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)
router.delete('/',)

module.exports = router