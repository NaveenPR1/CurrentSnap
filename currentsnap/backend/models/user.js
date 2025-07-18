// backend/models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'member'),
        defaultValue: 'member'
      },
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  
    User.associate = function(models) {
      User.hasMany(models.Post, { foreignKey: 'userId' });
    };
  
    return User;
  };
  