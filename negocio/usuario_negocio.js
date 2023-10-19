const userPersistence = require('../persistencia/usuario_persistencia')



    async function getUsers () {
        try{
        console.log('chegou no negócio')
        return await userPersistence.getUsers();
        } catch(error) {
            throw new Error ('Erro ao chamar camada de Persistencia' + error.message)
        }
    }

    async function searchById (userId) {
        try {
            console.log('Chegou na função searchById do negócio');
            const user = await userPersistence.searchById(userId);
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar usuário por ID no negócio: ' + error.message);
        }
    }
    async function getUserProfiles (userId) {
        try {
            const user = await userPersistence.getUserProfiles(userId);
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar perfis do usuário no negócio: ' + error.message);
        }
    }

    async function insertUser (userData) {
        try {
            const newUser = await userPersistence.insertUser(userData);
            return newUser;
        } catch (error) {
            throw new Error('Erro ao inserir usuário na camada de negócios: ' + error.message);
        }
    }

    async function login (email, password) {
        try {
            console.log('Chegou na função login do negócio');
            const user = await userPersistence.login(email, password);
            return user;
        } catch (error) {
            throw new Error('Erro no login no negócio: ' + error.message);
        }
    }

    module.exports = {
        insertUser,getUsers,searchById, login, getUserProfiles
    };

