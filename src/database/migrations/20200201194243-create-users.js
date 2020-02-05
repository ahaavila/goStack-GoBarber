module.exports = {
  // quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      // senha criptografada
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // quando for um cliente = 0, quando for um prestador de serviços = 1
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  // quando for dado um rollback na migration
  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
