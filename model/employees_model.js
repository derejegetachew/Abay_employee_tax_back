module.exports = (sequelize, Sequelize) => {
    const employees = sequelize.define("employees", {
    status: {
         type: Sequelize.STRING,
         },
    trial: {
        type: Sequelize.STRING, 
      },
    });
    return employees;
  };