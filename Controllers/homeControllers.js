const bcrypt = require('bcryptjs')
const user = require('../Model/userModel')
const pass = require('../Model/passWordModel')
const jwt = require('jsonwebtoken')

class homeController{
    async home(req, res){
        var select = await user.select()
        res.json(select)
    }

    async selectId(req, res){
        var select = await user.selectId(req.params.id)
        if (select.length == 0) {
            res.sendStatus(404)
        } else {
            res.json(select)
        }
    }

    async delete(req, res){
        user.delete(req.params.id)
    }

    async insert(req, res){
        var {nome, email, senha} = req.body
        var existemail = await user.emailExist(email)
        if(nome == undefined || email == undefined || senha == undefined){
            res.sendStatus(401)
        }else if(nome == '' || email == '' || senha == ''){
            res.sendStatus(401)
        }else if(existemail){
            res.sendStatus(401)
        }else{
            user.insert(nome, email, senha)
            res.sendStatus(200)
        }
    }
    
    async gerarToken(req, res){
        var {email} = req.body

        if (email != undefined || email != '') {

            var select = await user.selectEmail(email)

            if (select.length == 0) {
                res.sendStatus(404)
            } else {
                pass.insert(select[0].id)
            }

        } else {
            res.sendStatus(401)
        }
    }

    async update(req, res) {
        var {nome, email, senha, nivel} = req.body
        var select = await user.selectId(req.params.id)
        if (select.length == 0) {
            res.sendStatus(404)
        } else {
            user.update(nome, email, senha, nivel, req.params.id)
        }
    }

    async novaSenha(req, res){
        var {senha, token} = req.body

        if (token != undefined || token != '' || senha != undefined || senha != '') {
            var tk  = await pass.selectToken(token)
            if (tk.length == 1) {
                user.novaSenha(senha, tk[0].user_id)
                pass.updateToken(tk[0].token)
            } else {
                res.sendStatus(404)
                console.log(tk)
            }
        } else {
            res.sendStatus(401)
        }
    }

    async login(req, res){
        var secret = 'qwertyuiop´[asdfghjklç~]\zxcvbnm,.;/1234567890-='
        var {senha, email} = req.body
        var select = await user.selectEmail(email)
        if (select.length == 0) {
            res.sendStatus(404)
        } else {
            var result = await bcrypt.compare(senha, select[0].senha)
            if(result) {
                var token = await jwt.sign({email: email, nivel: select[0].nivel}, secret)
                console.log(token)
            } else {
                res.sendStatus(406)
            }
        }
    
    }
}

module.exports = new homeController()