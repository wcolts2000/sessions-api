
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', user => {
    user.increments();

    user.string('username', 255).unique().notNullable();
    user.string('name', 255).notNullable();
    user.string('password', 255).notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
