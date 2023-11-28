
const { pool } = require('./conexao');
const { Client } = require('pg');


async function getBand() {
  try {
    // Obtém um cliente do pool de conexões
    const client = await pool.connect();
    console.log('conectei no banco')
    const result = await client.query('SELECT * FROM bands');
    // Libera o cliente de volta para o pool de conexões
    client.release();
    console.log('Resultado da consulta:', result.rows);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter usuários: ' + error.message);
  }
}


async function searchById(bandId) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM bands WHERE band_id = $1';
    const result = await client.query(query, [bandId]);
    client.release();

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Erro ao buscar banda por ID: ' + error.message);
  }
}

async function insertBand(bandData) {
  try {
    const client = await pool.connect();

    // Obter o último ID da tabela
    const max = await client.query('SELECT MAX(id) FROM bands');
    const lastId = max.rows[0].max || 0;

    // Gerar o novo ID
    const newId = 'B' + String(lastId + 1).padStart(4, '0');

    const query = 'INSERT INTO BANDS (NAME, CITY, FACEBOOK_PAGE, YOUTUBE_PAGE, IG_PAGE, IMG_URL, WHATSAPP, MUSICAL_GENRE, DESCRIPTION, BAND_ID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const values = [bandData.name, bandData.city, bandData.facebook_page, bandData.youtube_page, bandData.ig_page, bandData.img_url, bandData.whatsapp, bandData.musical_genre, bandData.description, newId];
    const result = await pool.query(query, values);
    client.release();

    const userBandsQuery = `INSERT INTO user_bands (user_id, band_id) VALUES ($1, $2)`

    bandData.user_ids.forEach(async user_id => {
      await pool.query(userBandsQuery, [user_id,  newId])
    });

    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao inserir banda no banco de dados: ' + error.message);
  }
}

async function deleteBand(bandId) {
	
  const client = await pool.connect();

  try {
    const sql = "DELETE FROM bands WHERE band_id = $1 RETURNING *";
    const values = [bandId];

    const res = await client.query(sql, values);

    if (res.rows && res.rows.length > 0) {
      const band = res.rows[0];
      return band;
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await client.end();
  }
}

async function updateBand(id, dados) {
	const client = await pool.connect();

  try {

    const sql = `UPDATE bands SET name=$1, facebook_page=$2, youtube_page=$3, ig_page=$4, whatsapp=$5, city=$6, img_url=$7, musical_genre=$8, description=$9
                  WHERE band_id = $10
                  RETURNING *`

    const values = [dados.name, dados.facebook_page, dados.youtube_page, dados.ig_page, dados.whatsapp, dados.city, dados.img_url, dados.musical_genre, dados.description, id];
		console.log(values);

    const res = await client.query(sql, values);
		if (res.rows && res.rows.length > 0) {
      const user = res.rows[0];
      return user;
    } else {
      throw new Error("Solicitação não encontrada");
    }
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await client.end();
  }
}


module.exports = {
  insertBand, getBand, searchById, deleteBand, updateBand
};