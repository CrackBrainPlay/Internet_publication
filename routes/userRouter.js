const Router = require('express') // получаем роутер из express
const router = new Router() // создаём объект этого Router
const userController = require('../controllers/userController')
// для использования нашего мидлваер проверки авторизации
const authMiddleware = require('../middleware/authMiddleware')

// методы для работы с брендами
// метод регистрации, вторым метод из контроллера
router.post('/registration', userController.registration)
// метод авторизации, вторым метод из контроллера
router.post('/login', userController.login)
// метод проверки авторизован ли (будет делаться по дживити токену), вторым метод из контроллера
// передаём наш мидал вар вторым параметром
router.get('/auth', authMiddleware, userController.check)

// пример проверки работоспособности
//router.get('/auth', (req, res) => {
//  res.json({ message: 'ALL WORKING' })
//}) 

module.exports = router