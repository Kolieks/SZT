// src/models/Event.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Event extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public date!: Date;
}

Event.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "events",
    timestamps: false,
    underscored: true,
    sequelize,
  }
);

export default Event;
