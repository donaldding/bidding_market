const db = require('../db/schema')

async function truncate () {
  return Promise.all(
    // Object.keys(db).map(key => {
    //   if (['sequelize', 'Sequelize'].includes(key)) return
    //   return db[key].destroy({ where: {}, force: true })
    // })
    [db.sequelize.sync({ force: true })]
  )
}

module.exports = truncate
