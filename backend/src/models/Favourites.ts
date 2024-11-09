// src/models/Favourites.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Favourites extends Model {
  public id!: number;
  public game_id!: number;
  public user_id!: number;
}

Favourites.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "favourites",
    timestamps: false,
    sequelize,
  }
);

export default Favourites;
