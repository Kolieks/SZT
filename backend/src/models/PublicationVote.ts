// src/models/PublicationVote.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class PublicationVote extends Model {
  public id!: number;
  public user_id!: number;
  public publication_id!: number;
  public liked!: boolean;
}

PublicationVote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    publication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "publication_votes",
    timestamps: false,
    sequelize,
  }
);

export default PublicationVote;
