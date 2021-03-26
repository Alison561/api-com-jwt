const knex = require('./conn')
const bcrypt = require('bcryptjs')

class userModel{
    async select(){
        var select = await knex.select(['id', 'nome', 'email', 'nivel']).table('user')
        return select
    }

    async selectId(id){
        var select = await knex.select(['id', 'nome', 'email', 'nivel']).where({id: id}).table('user')
        return select
    }

    async selectEmail(email){
        var select = await knex.select().where({email: email}).table('user')
        return select
    }

    async emailExist(email){
        var select = await knex.select(['email']).where({email: email}).table('user')
        if (select.length == 1) {
            return true
        } else {
            return false
        }
    }
    
    async delete(id){
        await knex.del().where({id: id}).table('user')
    }

    async update(nome, email, pass, nivel, id){
        var senha = await bcrypt.hashSync(pass, 10)
        try {
            await  knex.update({nome: nome, email: email, senha: senha, nivel: nivel}).where({id: id}).table('user')
        } catch (error) {
            console.log(error)
        }
    }

    async novaSenha(pass, id){
        var senha = await bcrypt.hashSync(pass, 10)
        try {
            await  knex.update({senha: senha}).where({id: id}).table('user')
        } catch (error) {
            console.log(error)
        }
    }


    async insert(nome, email, pass){
        var senha = await bcrypt.hashSync(pass, 10)
        try {
            await  knex.insert({nome: nome, email: email, senha: senha, nivel: 0}).into('user')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new userModel