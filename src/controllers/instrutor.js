const Instrutor = require('../models/instrutor')
const Aula = require('../models/aula')
const util = require('../utils')

module.exports = {
    async show (req, res) {

        const data = await Instrutor.findAll()

        return res.render('instrutor', { data })
    },

    async create (req, res) {

        const validaCPF = util.testaCPF(req.body.cpf)

        if (validaCPF) {

            const cpfFormatado = util.formataCPF(req.body.cpf)

            const conferencia = await Instrutor.findCPF(cpfFormatado)
        
            if(conferencia.cpf == cpfFormatado) {
                return res.send("Instrutor já cadastrado")
            } else {
    
                const testenome = req.body.nome
                const testecpf = req.body.cpf
    
                if (testenome.length <= 10 || testecpf.length != 11 ) {
                    res.send("Nome ou CPF inválidos")
                } else {
                    try {
                        await Instrutor.create({
                            cpf: req.body.cpf,
                            nome: req.body.nome,
                            categoria: req.body.cat
                        })
            
                        const cpf = req.body.cpf
            
                        await Instrutor.mask(cpf)
            
                        return res.send("Instrutor cadastrado com sucesso")
                    } catch (err) {
                        throw err
                    }
                }
            }
        } else {
            return res.send("CPF não existe")
        }
    },

    async atualiza (req, res) {

        const dados = await Instrutor.findId(req.params.id)
        res.render('atualizaInstrutor', {dados})

    },

    async update (req, res) {

        const dados = {
            nome: req.body.nome,
            categoria: req.body.cat
        }

        const id = req.params.id

        await Instrutor.update(dados, id)

        return res.send("Cadastro atualizado")
    },
    
    async delete(req, res) {
        const id = req.params.id
        
        const buscaAgenda = await Aula.findInstrutorAtAula(id)

        if (buscaAgenda) {
            return res.send("Instrutor não pode ser deletado pois já teve aula marcada")
        } else {
            await Instrutor.deleteInstrutor(id)
            return res.send("Instrutor deletado")
        }
    }
}