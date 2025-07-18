// backend/models/post.js
module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'posts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    Post.associate = function(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Post;
  };
  