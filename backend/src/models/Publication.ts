// src/models/Publication.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Publication extends Model {
  public id!: number;
  public title!: string;
  public abstract!: string;
  public content!: string;
  public author!: number;
  public likes!: number;
  public dislikes!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Publication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    abstract: {
      type: new DataTypes.STRING(250),
      allowNull: false,
    },
    content: {
      type: new DataTypes.STRING(5000),
      allowNull: false,
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "publications",
    timestamps: true,
    underscored: true,
    sequelize,
  }
);

export default Publication;
