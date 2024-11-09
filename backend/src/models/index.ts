// src/models/index.ts
import sequelize from "../config/database";

// Import all models
import User from "./User";
import Publication from "./Publication";
import Game from "./Game";
import Rating from "./Rating";
import Comment from "./Comment";
import PublicationVote from "./PublicationVote";
import CommentVote from "./CommentVote";
import Favourites from "./Favourites";

// Define associations

// User - Publications
User.hasMany(Publication, { foreignKey: "author", as: "publications" });
Publication.belongsTo(User, { foreignKey: "author", as: "authorDetails" });

// User - Comments
User.hasMany(Comment, { foreignKey: "user_id", as: "comments" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User - Ratings
User.hasMany(Rating, { foreignKey: "user_id", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User - PublicationVotes
User.hasMany(PublicationVote, {
  foreignKey: "user_id",
  as: "publicationVotes",
});
PublicationVote.belongsTo(User, { foreignKey: "user_id", as: "user" });

// // Publication - Comments
// Publication.hasMany(Comment, { foreignKey: "entity_id", as: "comments" });
// Comment.belongsTo(Publication, {
//   foreignKey: "entity_id",
//   as: "publication",
// });
// // Game - Comments
// Game.hasMany(Comment, { foreignKey: "entity_id", as: "comments" });
// Comment.belongsTo(Game, {
//   foreignKey: "entity_id",
//   as: "game",
// });

// User - Favourites
User.hasMany(Favourites, { foreignKey: "user_id", as: "favourites" });
Favourites.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Game - Favourites
Game.hasMany(Favourites, { foreignKey: "game_id", as: "favourites" });
Favourites.belongsTo(Game, { foreignKey: "game_id", as: "game" });

// Publication - PublicationVotes
Publication.hasMany(PublicationVote, {
  foreignKey: "publication_id",
  as: "votes",
});
PublicationVote.belongsTo(Publication, {
  foreignKey: "publication_id",
  as: "publication",
});

// Game - Ratings
Game.hasMany(Rating, { foreignKey: "game_id", as: "ratings" });
Rating.belongsTo(Game, { foreignKey: "game_id", as: "game" });

// User - CommentVotes
User.hasMany(CommentVote, { foreignKey: "user_id" });
CommentVote.belongsTo(User, { foreignKey: "user_id" });

// Comment - CommentVotes
Comment.hasMany(CommentVote, { foreignKey: "comment_id" });
CommentVote.belongsTo(Comment, { foreignKey: "comment_id" });

// Export models
export {
  sequelize,
  User,
  Publication,
  Game,
  Rating,
  Comment,
  PublicationVote,
  CommentVote,
  Favourites,
};
