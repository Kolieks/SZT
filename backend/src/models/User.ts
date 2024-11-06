// src/models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: number;
  public email!: string;
  public name!: string;
  public password!: string;
  public isAdmin!: boolean;
  public isVisible!: boolean;
  public lastLogin!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    isAdmin: {
      type: new DataTypes.BOOLEAN(),
      allowNull: false,
    },
    isVisible: {
      type: new DataTypes.BOOLEAN(),
      allowNull: false,
    },
    lastLogin: {
      type: new DataTypes.DATE(),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
    sequelize,
  }
);

export default User;
