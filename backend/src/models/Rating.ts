// src/models/Rating.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Rating extends Model {
  public id!: number;
  public userId!: number;
  public gameId!: number;
  public rating!: number;
}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "ratings",
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default Rating;
