module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
    username: {
        type: Sequelize.STRING,
      },
    tin_number: {
        type: Sequelize.STRING,
      },
    email: {
        type: Sequelize.STRING, 
      },
    is_active: {
        type: Sequelize.STRING,
      },                                        
    },
    {
      timestamps: false 
    });
    return  users;
  };