import { DataTypes } from "sequelize";
import db from "../db.js";

const User = db.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    activationLink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ["user"],
    },
});

const Token = db.define("refresh_token", {
    token: {
        type: DataTypes.STRING(350),
        allowNull: false,
    },
});

User.hasOne(Token);
Token.belongsTo(User);

export {
    User,
    Token,
}