// src/models/CommentVote.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class CommentVote extends Model {
  public id!: number;
  public user_id!: number;
  public comment_id!: number;
  public liked!: boolean;
}

CommentVote.init(
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "comment_votes",
    timestamps: false,
    sequelize,
  }
);

export default CommentVote;
