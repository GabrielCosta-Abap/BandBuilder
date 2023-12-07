
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

async function searchFeedProfiles(filter, category, myUser) {
	try {
        console.log('chegou na feed get')
		const user = await userPersistence.searchFeedProfiles(filter, category, myUser);
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
async function solicitationAcceptReject(receiverId, senderId, solicitationStatus){

	try {
		return await userPersistence.solicitationAcceptReject(receiverId, senderId, solicitationStatus);
	} catch (error) {
		throw new Error('Erro ao chamar camada de Persistencia' + error.message)
	}
}
async function getContacts(id){

	try {
		return await userPersistence.getContacts(id);
	} catch (error) {
		throw new Error('Erro ao chamar camada de Persistencia' + error.message)
	}
}

async function updateUser(id, dados){
	try {
    if (!dados.name) {
      throw { code: 400, message: "É necessário fornecer pelo menos nome ou email para atualizar o usuário" };
    }
		return await userPersistence.updateUser(id, dados);
	} catch (error) {
    throw { code: 500, message: 'Erro na camada de negócios: ' + error.message };
  }
}


async function getSolicitations(senderId) {
	try {
		console.log('Chegou no negócio')
		return await userPersistence.getSolicitations(senderId);
	} catch (error) {
		throw new Error('Erro ao chamar camada de Persistencia' + error.message)
	}
}

async function bandBuild(user_id, instruments, musical_genre) {
		try{if (!user_id || !instruments || !musical_genre) {
      throw { code: 400, message: "É necessário fornecer id instrumentos e gênero musical para função "};
    }console.log(user_id, instruments, musical_genre);
		return await userPersistence.bandBuild(user_id, instruments, musical_genre);
	} catch (error) {
    throw { code: 500, message: 'Erro na camada de negócios: ' + error.message };
  }
}


module.exports = {
	insertUser, 
	getUsers, 
	searchById, 
	login, 
	getUserProfiles, 
	deleteUser, 
	searchFeedProfiles, 
	sendContactSolic, 
	getContactSolics, 
	solicitationAcceptReject,
	getContacts,
	updateUser,
	getSolicitations,
	bandBuild
};

