const Router = require('express') // получаем роутер из express
const router = new Router() // создаём объект этого Router
// необходимо указать функции которые будут отрабатывать при том или ином маршруте
const typeController = require('../controllers/typeController')
// добавляем middleware на проверку роли
const checkRole = require('../middleware/checkRoleMiddleware')

// методы для работы с брендами
// нам необходимо вторым параметром не просто передать, а ещё и добавить роль
router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.delete('/',)

module.exports = router