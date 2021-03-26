const knex = require('./conn')
const user  = require('./userModel')

class passWordModel{
    async insert(id){
        try {
            await  knex.insert({
                user_id: id,
                token: Date.now(),
                used: 0
            }).into('token')
        } catch (error) {
            console.log(error)
        }
    }

    async selectToken(tk){
        var select = await knex.select().whereRaw('token = ? && used = 0', [tk]).table('token')
        return select
    }

    async updateToken(tk){
        try {
            await  knex.update({used: 1}).where({token: tk}).table('token')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new passWordModel