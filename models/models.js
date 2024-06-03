const sequelize = require('../db') // импортируем наш объект

const { DataTypes } = require('sequelize') // далее импортируем из этого объекта метод для описания

// описываем модель пользователя
const User = sequelize.define('user', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // далее email с типом string, он должен быть уникальным
    email: { type: DataTypes.STRING, unique: true },
    // пароль
    password: { type: DataTypes.STRING },
    // роль то же имеет типо string, и по умолчанию роль USER
    role: { type: DataTypes.STRING, defaultValue: "USER" }
})

// описываем модель корзины
const Basket = sequelize.define('basket', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

// описываем модель товаров в корзине корзины
const BasketDevice = sequelize.define('basket_device', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

// описываем модель товара
const Device = sequelize.define('device', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING }
})

// описываем type
const Type = sequelize.define('type', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
})

// описываем Brand
const Brand = sequelize.define('brand', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false }
})

// описываем сущность rating
const Rating = sequelize.define('rating', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
})

// описываем сущность rating
const DeviceInfo = sequelize.define('device_info', {
    // id с типом integer, и так же будем гинерировать ему автоматически id
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
})


// связующая модель
const TypeBrand = sequelize.define('type_brand', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

// указывает что одна запись Device содержит много записей DeviceInfo
//Device.hasMany(DeviceInfo),
// указывает что DeviceInfo принадлежит Device
//DeviceInfo.belongsTo(Device)

// связь между User и Basket (1 к 1)
User.hasOne(Basket)
// сообщаем что Basket > принадлежит User
Basket.belongsTo(User)

// User могут принадлежать много Rating
User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, { as: 'info' })
DeviceInfo.belongsTo(Device)

// нужн второй аргумент, тут уазывается связующая таблица 
//тип много ко многим (при такой свяязе создаётся промежуточная таблица)
Type.belongsToMany(Brand, { through: TypeBrand })
Brand.belongsToMany(Type, { through: TypeBrand })

// экспортирование моделей
module.exports = {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo
}