
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

// async function getUserProfiles(userId) {
//   try {
//     const client = await pool.connect();
//     const query = `SELECT * 
//                      FROM bands 
//                      JOIN user_bands ON user_bands.band_id = bands.band_id 
//                      WHERE user_bands.user_id = $1`;
//     const result = await client.query(query, [userId]);
//     client.release();

//     if (result.rows.length > 0) {
//       return result.rows;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw new Error('Erro ao buscar perfis do usuário: ' + error.message);
//   }
// }

async function insertBand(bandData) {
  try {
    const client = await pool.connect();
    const query = 'INSERT INTO BANDS (NAME, CITY, FACEBOOK_PAGE, YOUTUBE_PAGE, IG_PAGE, IMG_URL, WHATSAPP) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [bandData.NAME, bandData.CITY, bandData.FACEBOOK_PAGE, bandData.YOUTUBE_PAGE, bandData.IG_PAGE, bandData.IMG_URL, bandData.WHATSAPP];
    const result = await pool.query(query, values);
    client.release();

    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao inserir usuário no banco de dados: ' + error.message);
  }
}

// Definir login como banda
// async function login(email, password) {
//   try {
//     const client = await pool.connect();
//     const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
//     const result = await client.query(query, [email, password]);
//     client.release();

//     if (result.rows.length > 0) {
//       return result.rows[0];
//     } else {
//       return null;
//     }
//   } catch (error) {
//     throw new Error('Erro ao realizar login: ' + error.message);
//   }
// }

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