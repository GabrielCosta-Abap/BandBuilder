const userNegocio = require('../negocio/usuario_negocio');

module.exports = {
    getUsers: async (req, res) => {
        console.log('Chegou no controller');
        try {
            const users = await userNegocio.getUsers();
            res.status(200).json(users);
        } catch (error) {
            if (error && error.code) {
                res.status(error.code).send(error.message);
            } else {
                res.status(500).send('Deu pau na chamada da API: ' + error.message);
            }
        }
    },

    searchById: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await userNegocio.searchById(userId);           
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).send('Usuário não encontrado');
            }
        } catch (error) {
            if(error && error.code) {
                res.status(error.code).json({erro: error.message});
              }
              else {
                res.json(user);
              }
        }
    },

    insertUser: async (req, res) => {
        const userData = req.body; 
        try {
            const newUser = await userNegocio.insertUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao inserir usuário: ' + error.message });
        }
    }


};
