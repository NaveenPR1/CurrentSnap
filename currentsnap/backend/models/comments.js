// backend/models/comment.js
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      tableName: 'comments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
    
    Comment.associate = function(models) {
      Comment.belongsTo(models.User, { foreignKey: 'userId' });
      Comment.belongsTo(models.Post, { foreignKey: 'postId' });
    };
  
    return Comment;
  };
  