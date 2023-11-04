
const { pool } = require('./conexao');
const { Client } = require('pg');


async function getUsers() {
  try {
    // Obtém um cliente do pool de conexões
    const client = await pool.connect();
    console.log('conectei no banco')
    const result = await client.query('SELECT * FROM users');
    // Libera o cliente de volta para o pool de conexões
    client.release();
    console.log('Resultado da consulta:', result.rows);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter usuários: ' + error.message);
  }
}

async function searchById(userId) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await client.query(query, [userId]);
    client.release();

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Erro ao buscar usuário por ID: ' + error.message);
  }
}

async function getUserProfiles(userId) {
  try {
    const client = await pool.connect();
    const query = `SELECT * 
                     FROM bands 
                     JOIN user_bands ON user_bands.band_id = bands.band_id 
                     WHERE user_bands.user_id = $1`;
    const result = await client.query(query, [userId]);
    client.release();

    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Erro ao buscar perfis do usuário: ' + error.message);
  }
}

async function searchFeedProfiles(filter, category) {
  try {
    let feedContent = [];
    const client = await pool.connect();
    let query = ''
    let query2 = ''
    let result = {}
    let result2 = {}

    const searchValue = `%${filter}%`;

    if (category != 2) { // se pede por músicos
      
      if (filter && filter != 'all') {

        query = `SELECT * 
                   FROM users 
                   WHERE UPPER(name) = UPPER($1)
                      OR UPPER(instruments) LIKE UPPER($2)
                      OR UPPER(musical_genre) = UPPER($3)
                      OR UPPER(city) = UPPER($4)`;

        console.log(query)
        console.log(filter, searchValue)
        result = await client.query(query, [filter, searchValue, filter, filter]);
        
      }else{
        query = `SELECT * FROM users`;
        result = await client.query(query);
      }
      
      feedContent = feedContent.concat(result.rows);

    }
    
    if (category != 3) { // se pede por bandas
      
      if (filter && filter != 'all') {

        query2 = `SELECT * 
                    FROM bands
                    WHERE UPPER(name) = UPPER($1)
                       OR UPPER(musical_genre) = UPPER($2)
                       OR UPPER(city) = UPPER($3)`;

        result2 = await client.query(query2, [filter, filter, filter]);

      }else{
        query2 = `SELECT * FROM bands`;
        result2 = await client.query(query2);
      }
      
      feedContent = feedContent.concat(result2.rows);
      
    }

    client.release();

    console.log('passou da busca toda')
    if (feedContent.length > 0) {
      return feedContent;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Erro ao buscar informações do feed: ' + error.message);
  }
}

async function insertUser(userData) {
  try {
    const client = await pool.connect();
    const query = 'INSERT INTO USERS (PHONE, NAME, GENDER, EMAIL, PASSWORD, BIRTH_DATE, CITY, LANGUAGES, INSTRUMENTS, ADDRESS, MUSICAL_GENRE, MUSICAL_EXPERIENCE, DESCRIPTION, IMG_URL, WHATSAPP, YOUTUBE_LINK) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *';
    const values = [userData.PHONE, userData.NAME, userData.GENDER, userData.EMAIL, userData.PASSWORD, userData.BIRTH_DATE, userData.CITY, '', '', '', userData.MUSICAL_GENRE, userData.MUSICAL_EXPERIENCE, userData.DESCRIPTION, userData.IMG_URL, userData.WHATSAPP, userData.YOUTUBE_LINK];
    const result = await pool.query(query, values);
    client.release();

    return result.rows[0];
  } catch (error) {
    throw new Error('Erro ao inserir usuário no banco de dados: ' + error.message);
  }
}

async function login(email, password) {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const result = await client.query(query, [email, password]);
    client.release();

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw new Error('Erro ao realizar login: ' + error.message);
  }
}

async function deleteUser(userId) {
	
  const client = await pool.connect();

  try {
    const sql = "DELETE FROM users WHERE user_id = $1 RETURNING *";
    const values = [userId];

    const res = await client.query(sql, values);

    if (res.rows && res.rows.length > 0) {
      const user = res.rows[0];
      return user;
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await client.end();
  }
}

async function sendContactSolic(senderId, receiverId){
  const client = await pool.connect();
  // STATUS:
  // P - Pendente,
  // C - Cancelada,
  // A - Solic. Aceita
  // R - Solic. Recusada

  try {
    let query = ''

    const values = [senderId, receiverId];

    const check = await client.query('SELECT * FROM solicitations WHERE sender_id = $1 AND receiver_id = $2', values)

    console.log(check)
    if (check.rows && check.rows.length > 0) {
     
      let status = check.rows[0].status == 'C' ? 'P' : 'C'
      values.push(status)
     
      query = `UPDATE solicitations SET status = $3 WHERE sender_id = $1 AND receiver_id = $2 RETURNING *`
    }else{
      query = "INSERT INTO solicitations (sender_id, receiver_id, status) VALUES ($1, $2, 'P') RETURNING *";
    }
    
    const res = await client.query(query, values);
  
    if (res.rows && res.rows.length > 0) {
      const user = res.rows[0];
      return user;
    } else {
      throw new Error("Usuário não encontrado");
    }
  } catch (error) {
    throw new Error(error.message);
  } finally {
    await client.end();
  }

}

async function getContactSolics(receiverId){
  try {

    const client = await pool.connect();

    console.log(receiverId)
    const result = await client.query(`SELECT solicitations.sender_id,
                                              users.user_id,
                                              users.name,
                                              users.instruments,
                                              users.musical_genre,
                                              users.city,
                                              users.img_url,
                                              bands.band_id,
                                              bands.name,
                                              bands.musical_genre,
                                              bands.city,
                                              bands.img_url
                                         FROM solicitations
                                         LEFT JOIN users ON users.user_id = solicitations.sender_id
                                         LEFT JOIN bands ON bands.band_id = solicitations.sender_id
                                         WHERE receiver_id = $1
                                           AND status      = 'P'`, [receiverId]);
    // Libera o cliente de volta para o pool de conexões
    client.release();
    console.log('Resultado da consulta:', result.rows);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter usuários: ' + error.message);
  }
}

module.exports = {
  insertUser, getUsers, searchById, login, getUserProfiles, deleteUser, searchFeedProfiles,sendContactSolic, getContactSolics
};