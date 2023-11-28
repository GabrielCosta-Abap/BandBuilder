const bandNegocio = require('../negocio/banda_negocio');

async function getBand(req, res) {
	console.log('Chegou no controller de bandas');
	try {
		const bands = await bandNegocio.getBand();
		res.status(200).json(bands);
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).send(error.message);
		} else {
			res.status(500).send('Deu pau na chamada da API: ' + error.message);
		}
	}
}

async function searchById(req, res) {
	const bandId = req.params.id;
	try {
		const band = await bandNegocio.searchById(bandId);
		if (band) {
			res.status(200).json(band);
		} else {
			res.status(404).send('Banda não encontrada');
		}
	} catch (error) {
		if (error && error.code) {
			res.status(error.code).json({ erro: error.message });
		}
		else {
			res.json(band);
		}
	}
}


async function insertBand(req, res) {
	const bandData = req.body;
	try {
		const newBand = await bandNegocio.insertBand(bandData);
		res.status(201).json(newBand);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao inserir banda: ' + error.message });
	}
}

async function deleteBand(req, res){
	const bandId = req.params.id;
	console.log(bandId);

  try {

    await bandNegocio.deleteBand(bandId);

    return res.status(200).json({ message: 'Banda excluída com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function updateBand(req, res) {
	try {
    const { id } = req.params;
    const dados = req.body;

    const updatedBand = await bandNegocio.updateBand(id, dados);
    res.status(200).json(updatedBand);
  } catch (error) {
    if (error && error.code) {
      res.status(error.code).send(error.message);
    } else {
      res.status(500).send('Erro ao atualizar banda: ' + error.message);
    }
  }
}

module.exports = {
	insertBand, getBand, searchById, deleteBand, updateBand
};