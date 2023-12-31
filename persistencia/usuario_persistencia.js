
const { pool } = require('./conexao');
const { Client } = require('pg');


async function getUsers() {
  try {
    const client = await pool.connect();
    console.log('conectei no banco')
		const query = `SELECT A.user_id,
                          A.phone,
                          A.name, 
                          A.gender, 
                          A.email, 
                          A.password, 
                          A.birth_date, 
                          A.city, 
                          A.languages, 
                          A.address,
                          A.musical_genre, 
                          A.musical_experience, 
                          A.description, 
                          A.youtube_link, 
                          A.img_url, 
                          A.whatsapp,
                          B.INSTRUMENT_NAME
                      FROM USERS A
                      LEFT JOIN USER_INSTRUMENTS B
                      ON A.USER_ID = B.USER_ID`
    const result = await client.query(query);
    
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
    const query = `SELECT
										A.user_id,
										A.phone,
										A.name,
										A.gender,
										A.email,
										A.password,
										A.birth_date,
										A.city,
										A.languages,
										A.address,
										A.musical_genre,
										A.musical_experience,
										A.description,
										A.youtube_link,
										A.img_url,
										A.whatsapp,
										JSONB_AGG(B.INSTRUMENT_NAME) AS instruments
									FROM
										USERS A
									LEFT JOIN
										USER_INSTRUMENTS B ON A.USER_ID = B.USER_ID
									WHERE
										A.USER_ID = $1
									GROUP BY
										A.user_id,
										A.phone,
										A.name,
										A.gender,
										A.email,
										A.password,
										A.birth_date,
										A.city,
										A.languages,
										A.address,
										A.musical_genre,
										A.musical_experience,
										A.description,
										A.youtube_link,
										A.img_url,
										A.whatsapp`;
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

async function searchFeedProfiles(filter, category, myUser) {
  try {
    let feedContent = [];
    const client = await pool.connect();
    let query = ''
    let query2 = ''
    let result = {}
    let result2 = {}

    const searchValue = `%${filter}%`;

    console.log('1')
    
    if (category != 2) { // se pede por músicos
      
      console.log('2')

      if (filter && filter != 'all') {
        
        console.log('3')
        query = `SELECT
										u.user_id,
										u.name,
										u.phone,
										u.gender,
										u.email,
										u.password,
										u.birth_date,
										u.city,
										u.languages,
										u.address,
										u.musical_genre,
										u.musical_experience,
										u.description,
										u.youtube_link,
										u.img_url,
										u.whatsapp,
										ARRAY_AGG(ui.instrument_name) AS instruments
								FROM
										users u
								LEFT JOIN
										user_instruments ui ON u.user_id = ui.user_id
								WHERE(
										UPPER(u.name) LIKE UPPER($1)
										OR UPPER(ui.instrument_name) LIKE UPPER($2)
										OR UPPER(u.musical_genre) LIKE UPPER($3)
										OR UPPER(u.city) LIKE UPPER($4)
										OR UPPER(u.user_id) LIKE UPPER($5)
										)
										AND u.user_id NOT IN (
											SELECT receiver_id 
											FROM solicitations 
											WHERE sender_id = $6)
								GROUP BY
										u.user_id,
										u.name,
										u.phone,
										u.gender,
										u.email,
										u.password,
										u.birth_date,
										u.city,
										u.languages,
										u.address,
										u.musical_genre,
										u.musical_experience,
										u.description,
										u.youtube_link,
										u.img_url,
										u.whatsapp;`;
        
        
        console.log('3')
        console.log(query)
        console.log(filter, searchValue)
        result = await client.query(query, [searchValue, searchValue, searchValue, searchValue, searchValue, myUser]);

      } else {
        query = `SELECT * FROM users WHERE user_id NOT IN (SELECT receiver_id FROM solicitations WHERE sender_id = $1)`;
        console.log(myUser)
        result = await client.query(query, [myUser]);
        
      }

      feedContent = feedContent.concat(result.rows);

    }

    if (category != 3) { // se pede por bandas

      if (filter && filter != 'all') {

        query2 = `SELECT * 
        FROM bands
        WHERE (UPPER(name) LIKE UPPER($1)
           OR UPPER(musical_genre) LIKE UPPER($2)
           OR UPPER(city) LIKE UPPER($3)
           OR UPPER(band_id) LIKE UPPER($4))
           AND band_id NOT IN (SELECT receiver_id FROM solicitations WHERE sender_id = $5)`;


        result2 = await client.query(query2, [searchValue, searchValue, searchValue, searchValue, myUser]);

      } else {
        query2 = `SELECT * FROM bands WHERE band_id NOT IN (SELECT receiver_id FROM solicitations WHERE sender_id = $1)`;
        result2 = await client.query(query2, [myUser]);
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

    // Obter o último ID da tabela
    const max = await client.query('SELECT MAX(id) FROM users');
    const lastId = max.rows[0].max || 0;

    // Gerar o novo ID
    const newId = 'U' + String(lastId + 1).padStart(4, '0');

    const query = 'INSERT INTO USERS (USER_ID, PHONE, NAME, GENDER, EMAIL, PASSWORD, BIRTH_DATE, CITY, instruments, MUSICAL_GENRE, DESCRIPTION, IMG_URL, YOUTUBE_LINK) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *';
    const values = [newId, userData.PHONE, userData.NAME, userData.GENDER, userData.EMAIL, userData.PASSWORD, userData.BIRTH_DATE, userData.CITY, '', userData.MUSICAL_GENRE, userData.DESCRIPTION, userData.IMG_URL, userData.YOUTUBE_LINK];
		const result = await pool.query(query, values);
    client.release();

		const instrumentsQuery = `INSERT INTO USER_INSTRUMENTS (user_id, instrument_name) VALUES($1, $2)`
		userData.instruments.forEach(async instrument_name => {
      await pool.query(instrumentsQuery, [newId, instrument_name])
			console.log(newId, instrument_name)
    });

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

async function sendContactSolic(senderId, receiverId) {
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
    } else {
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

async function getContactSolics(receiverId) {
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

async function solicitationAcceptReject(receiverId, senderId, solicitationStatus) {

  const client = await pool.connect();

  try {

    const sql = `UPDATE solicitations SET status = $3 
                  WHERE sender_id = $2
                    AND receiver_id = $1
                  RETURNING *`

    const values = [receiverId, senderId, solicitationStatus];

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

async function getContacts(id) {
  try {

    const client = await pool.connect();

    console.log(id)
    const result = await client.query(`SELECT users.user_id,
                                              users.name,
                                              users.instruments,
                                              users.musical_genre,
                                              users.city,
                                              users.whatsapp,
                                              bands.band_id,
                                              bands.name,
                                              bands.musical_genre,
                                              bands.city,
                                              bands.whatsapp
                                         FROM solicitations
                                         LEFT JOIN users ON ( users.user_id != $1 )  
                                                      AND ( users.user_id = solicitations.sender_id
                                                         OR users.user_id = solicitations.receiver_id )
                                         LEFT JOIN bands ON ( band_id != $2 ) 
                                                        AND ( bands.band_id = solicitations.sender_id
                                                           OR bands.band_id = solicitations.receiver_id )
                                         WHERE ( solicitations.receiver_id = $1 OR solicitations.sender_id = $3 )
                                           AND solicitations.status = 'A'`, [id, id, id]);
    // Libera o cliente de volta para o pool de conexões
    client.release();
    console.log('Resultado da consulta:', result.rows);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter contatos: ' + error.message);
  }
}


async function updateUser(id, dados) {
  const client = await pool.connect();

  try {
    const instrumentsDeleteQuery = `DELETE FROM USER_INSTRUMENTS WHERE user_id = $1`;
    await client.query(instrumentsDeleteQuery, [id]);

    const sql = `UPDATE users SET phone=$1, name=$2, gender=$3, email=$4, password=$5, birth_date=$6, city=$7, languages=$8, instruments=$9, address=$10, musical_genre=$11, musical_experience=$12, description=$13, youtube_link=$14, img_url=$15, whatsapp=$16
                  WHERE user_id = $17
                  RETURNING *`;

    const values = [dados.phone, dados.name, dados.gender, dados.email, dados.password, dados.birthdate, dados.city, dados.languages, '', dados.address, dados.musical_genre, dados.musical_experience, dados.description, dados.youtube_link, dados.img_url, dados.whatsapp, id];
    const res = await client.query(sql, values);
    
    const instrumentsInsertQuery = `INSERT INTO USER_INSTRUMENTS (user_id, instrument_name) VALUES($1, $2)`;
    dados.instruments.forEach(async (instrument_name) => {
      await pool.query(instrumentsInsertQuery, [id, instrument_name]);
      console.log(id, instrument_name);
    });
    
    // client.release();
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


async function bandBuild(user_id, instruments, musical_genre, res) {
  try {
    let resultados = [];

    for (let i = 0; i < instruments.length; i++) {
      const instrumento = instruments[i].trim().toLowerCase();
			console.log(instrumento)
      const query = `
			SELECT * FROM user_instruments
			WHERE LOWER(instrument_name) LIKE $1
			AND USER_ID != $2
      `;
      const result = await pool.query(query, [`%${instrumento}%`, user_id]);
			console.log(query);

      if (result.rows.length === 0) {
        resultados.push(`Não encontramos usuários que dominem o instrumento: ${instrumento}`);
      } else {
				const usuariosPriorizados = result.rows.filter(user => user.musical_genre === musical_genre);

        if (usuariosPriorizados.length > 0) {
          resultados = resultados.concat(usuariosPriorizados);
        }else{
          resultados = resultados.concat(result.rows);
					console.log(resultados);
					return (resultados);
				}
        }
      }
    }catch (error) {
    console.error('Erro na busca de usuários:', error);
    res.status(500).send('Erro na busca de usuários');
  }
}

async function getSolicitations(senderId) {
  try {
    const client = await pool.connect();
		const query = `SELECT A.sender_id,
									A.receiver_id,
									A.status,
									B.NAME AS receiver_name,
                  B.*,
                  C.*
                  FROM solicitations A
									LEFT JOIN users B ON A.receiver_id = B.user_id
                  LEFT JOIN bands C ON A.receiver_id = C.band_id
									WHERE sender_id = $1
									AND UPPER(status) = 'P'`
    const result = await client.query(query, [senderId]);
    
    client.release();
    console.log('Resultado da consulta:', result.rows);
    return result.rows;
  } catch (error) {
    throw new Error('Erro ao obter usuários: ' + error.message);
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