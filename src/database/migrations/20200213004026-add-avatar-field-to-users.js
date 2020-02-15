module.exports = {
  up: (queryInterface, Sequelize) => {
    // funcao para adicionar um coluna em uma tabela existente
    return queryInterface.addColumn(
      // primeiro a tabela que quero add
      'users',
      // segundo o nome da coluna
      'avatar_id',
      {
        // Digo qual vai ser a tabela e qual o id que vou referenciar
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        // Se o id for editado na tabela dele, eu quero que ele altere tbm na tabela users.
        onUpdate: 'CASCADE',
        // Passo o que vai acontecer se algum dia o id referenciado for deletado na tabela dele.
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
