
const bandPersistence = require('../persistencia/banda_persistencia.js')


async function getBand() {
	try {
		console.log('chegou no negócio')
		return await bandPersistence.getBand();
	} catch (error) {
		throw new Error('Erro ao chamar camada de Persistencia' + error.message)
	}
}

async function searchById(bandId) {
	try {
		console.log('Chegou na função searchById do negócio');
		const band = await bandPersistence.searchById(bandId);
		return band;
	} catch (error) {
		throw new Error('Erro ao buscar banda por ID no negócio: ' + error.message);
	}
}

async function insertBand(bandData) {
	try {
		const newBand = await bandPersistence.insertBand(bandData);
		return newBand;
	} catch (error) {
		throw new Error('Erro ao inserir Banda na camada de negócios: ' + error.message);
	}
}

async function deleteBand(bandId) {
  try {
    
    const band = await bandPersistence.searchById(bandId);
    if (!band) {
      throw new Error('Banda não encontrada na camada de negocio');
    }

    await bandPersistence.deleteBand(bandId);

    return { message: 'Banda excluída com sucesso' };
  } catch (error) {
    throw new Error('Erro ao excluir usuário: ' + error.message);
  }
}

module.exports = {
	insertBand, getBand, searchById, deleteBand
};

