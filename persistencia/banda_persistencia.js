
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

    const query = 'INSERT INTO BANDS (BAND_ID, NAME, CITY, FACEBOOK_PAGE, YOUTUBE_PAGE, IG_PAGE, IMG_URL, WHATSAPP, MUSICAL_GENRE, DESCRIPTION) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [newId, bandData.name, bandData.city, bandData.facebook, bandData.youtube, bandData.instagram, '', bandData.whatsapp, bandData.musical_genre, bandData.description];
    const result = await pool.query(query, values);
    client.release();

    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao inserir usuário no banco de dados: ' + error.message);
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

module.exports = {
  insertBand, getBand, searchById, deleteBand
};