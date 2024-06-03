// создание middleWare для обработки Api
const ApiError = require('../error/ApiError');

// принимает следующие параметры ошибка, запрос, ответ, некст
module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) { // если приходит ошибка
        return res.status(err.status).json({ message: err.message })// возвращаем ошибку, с сообщением ошибки
    }
    // если попала неописанная ошибка
    return res.status(500).json({ message: 'Непридвиденная ошибка' })
}
