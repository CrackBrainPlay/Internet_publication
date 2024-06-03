// универсальный файл для ошибок
class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    // статическай функия (её можновызывать без создания объекта)
    static badRequest(message) {
        // первым передаём статус код (страница не найдена) а вторым сообщение которое будем получать
        return new ApiError(404, message)
    }
    static internal(message) {
        // первым передаём статус код () а вторым сообщение которое будем получать
        return new ApiError(500, message)
    }
    static forbidden(message) {
        // первым передаём статус код (ошибка доступа) а вторым сообщение которое будем получать
        return new ApiError(403, message)
    }
}
// обязательно надо прописывать для возможности использование класса
module.exports = ApiError;