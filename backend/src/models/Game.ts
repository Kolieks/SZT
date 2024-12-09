// src/models/Game.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Game extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public criticsRate!: number | null;
  public averageUserRate!: number;
  public producer!: string;
  public image!: string;
  public createdAt!: Date;
}

Game.init(
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
    description: {
      type: new DataTypes.STRING(5000),
      allowNull: false,
    },
    criticsRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    averageUserRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    producer: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    image: {
      type: new DataTypes.STRING(128),
      defaultValue: 0,
      allowNull: true,
    },
  },
  {
    tableName: "games",
    timestamps: true,
    underscored: true,
    sequelize,
  }
);

export default Game;
