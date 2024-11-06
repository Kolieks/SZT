// src/models/Comment.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Comment extends Model {
  public id!: number;
  public entityId!: number;
  public type!: number;
  public userId!: number;
  public content!: string;
  public createdAt!: Date;
  public likes!: number;
  public dislikes!: number;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: new DataTypes.STRING(1000),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    tableName: "comments",
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default Comment;
