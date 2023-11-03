
const userPersistence = require('../persistencia/usuario_persistencia')


async function getUsers() {
	try {
		console.log('chegou no negócio')
		return await userPersistence.getUsers();
	} catch (error) {
		throw new Error('Erro ao chamar camada de Persistencia' + error.message)
	}
}

async function searchById(userId) {
	try {
		console.log('Chegou na função searchById do negócio');
		const user = await userPersistence.searchById(userId);
		return user;
	} catch (error) {
		throw new Error('Erro ao buscar usuário por ID no negócio: ' + error.message);
	}
}
async function getUserProfiles(userId) {
	try {
		const user = await userPersistence.getUserProfiles(userId);
		return user;
	} catch (error) {
		throw new Error('Erro ao buscar perfis do usuário no negócio: ' + error.message);
	}
}

async function searchFeedProfiles(filter, category) {
	try {
        console.log('chegou na feed get')
		const user = await userPersistence.searchFeedProfiles(filter, category);
		return user;
	} catch (error) {
		throw new Error('Erro ao buscar perfis do usuário no negócio: ' + error.message);
	}
}

async function insertUser(userData) {
	try {
		const newUser = await userPersistence.insertUser(userData);
		return newUser;
	} catch (error) {
		throw new Error('Erro ao inserir usuário na camada de negócios: ' + error.message);
	}
}

async function login(email, password) {
	try {
		console.log('Chegou na função login do negócio');
		const user = await userPersistence.login(email, password);
		return user;
	} catch (error) {
		throw new Error('Erro no login no negócio: ' + error.message);
	}
}

async function deleteUser(userId) {
  try {
    
    const user = await userPersistence.searchById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado na camada de negocio');
    }

    await userPersistence.deleteUser(userId);

    return { message: 'Usuário excluído com sucesso' };
  } catch (error) {
    throw new Error('Erro ao excluir usuário: ' + error.message);
  }
}

async function sendContactSolic(senderId, receiverId){
	try {
	  
	  await userPersistence.sendContactSolic(senderId, receiverId);
	
	  return { message: 'Contato solicitado com sucesso!' };
	} catch (error) {
	  throw new Error('Erro ao solicitar contato: ' + error.message);
	}
	
}

async function getContactSolics(receiverId){

	try {
		return await userPersistence.getContactSolics(receiverId);
	} catch (error) {
		throw new Error('Erro ao chamar camada de Persistencia' + error.message)
	}

}

module.exports = {
	insertUser, getUsers, searchById, login, getUserProfiles, deleteUser, searchFeedProfiles, sendContactSolic, getContactSolics
};

