const userNegocio = require('../negocio/usuario_negocio');

async function login(req, res) {

	const email = req.body.email;
	const pasword = req.body.password;

	try {
		const user = await userNegocio.login(email, pasword);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send('Usuário não encontrado');
		}
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).json({ erro: error.message });
		}
		else {
			res.json(user);
		}
	}

}

async function getUsers(req, res) {
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
}

async function searchById(req, res) {
	const userId = req.params.id;
	try {
		const user = await userNegocio.searchById(userId);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send('Usuário não encontrado');
		}
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).json({ erro: error.message });
		}
		else {
			res.json(user);
		}
	}
}

async function getUserProfiles(req, res) {
	const userId = req.params.id;
	try {
		const user = await userNegocio.getUserProfiles(userId);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send('Nenhum perfil encontrado');
		}
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).json({ erro: error.message });
		}
		else {
			res.json(user);
		}
	}
}

async function searchFeedProfiles(req, res) {
	const filter = req.params.searchValue;
	const category = req.params.category;
	try {
		const user = await userNegocio.searchFeedProfiles(filter, category);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send('Nenhum perfil encontrado');
		}
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).json({ erro: error.message });
		}
		else {
			res.status(500).json({ erro: 'Bah magrão só sei q deu erro te vira' });
		}
	}
}

async function searchById(req, res) {
	const userId = req.params.id;
	console.log(userId)
	try {
		const user = await userNegocio.searchById(userId);
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).send('Usuário não encontrado');
		}
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).json({ erro: error.message });
		}
		else {
			res.json(user);
		}
	}
}

async function insertUser(req, res) {
	const userData = req.body;
	try {
		const newUser = await userNegocio.insertUser(userData);
		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao inserir usuário: ' + error.message });
	}
}

async function deleteUser(req, res) {
	const userId = req.params.id;
	console.log(userId);

	try {

		await userNegocio.deleteUser(userId);

		return res.status(200).json({ message: 'Usuário excluído com sucesso' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro interno do servidor' });
	}
}

async function sendContactSolic(req, res) {
	try {
		const senderId = req.params.senderId;
		const receiverId = req.params.receiverId;
		const { io } = require('../index.js')

		await userNegocio.sendContactSolic(senderId, receiverId);

		console.log(io)
		io.emit('newSolic', { message: 'Notificação de solicitação!!!' });

		return res.status(200).json({ message: 'Solicitação enviada com sucesso!' });

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Erro interno do servidor' });
	}

}

async function getContactSolics(req, res) {
	try {
		const receiverId = req.params.receiverId;
		const solicitations = await userNegocio.getContactSolics(receiverId);

		res.status(200).json(solicitations);
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).send(error.message);
		} else {
			res.status(500).send('Deu pau na chamada da API: ' + error.message);
		}
	}
}
async function solicitationAcceptReject(req, res) {
	try {
		const receiverId = req.params.receiverId;
		const senderId = req.params.senderId;
		const solicitationStatus = req.params.solicitationStatus;
		
		const solicitation = await userNegocio.solicitationAcceptReject(receiverId, senderId, solicitationStatus);

		res.status(200).json(solicitation);
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).send(error.message);
		} else {
			res.status(500).send('Deu pau na chamada da API: ' + error.message);
		}
	}
}

async function getContacts(req, res) {
	try {
		const id = req.params.id;
		const contacts = await userNegocio.getContacts(id);

		res.status(200).json(contacts);
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).send(error.message);
		} else {
			res.status(500).send('Deu pau na chamada da API: ' + error.message);
		}
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
	getContacts
};