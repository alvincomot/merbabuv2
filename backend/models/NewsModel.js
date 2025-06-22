import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const News = db.define('news', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: { notEmpty: true }
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    konten: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    userId: { // Kolom untuk relasi ke tabel users
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: false // Bisa jadi null jika user dihapus
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(News);
News.belongsTo(Users, { foreignKey: 'userId' });

export default News;