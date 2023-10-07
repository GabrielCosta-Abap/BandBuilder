const userPersistence = require('../persistencia/usuario_persistencia')

module.exports = {

    getUsers: async ()=>{
        console.log('chegou no negócio')
        return await userPersistence.getUsers();
    },

    searchById: async (userId) => {
        try {
            console.log('Chegou na função searchById do negócio');
            const user = await userPersistence.searchById(userId);
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar usuário por ID no negócio: ' + error.message);
        }
    },

    insertUser: async (userData) => {
        try {
            const newUser = await userPersistence.insertUser(userData);
            return newUser;
        } catch (error) {
            throw new Error('Erro ao inserir usuário na camada de negócios: ' + error.message);
        }
    }

};