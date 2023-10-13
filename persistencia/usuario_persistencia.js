
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

async function insertUser(userData) {
  try {
    const client = await pool.connect();
    const query = 'INSERT INTO USERS (PHONE, NAME, GENDER, EMAIL, PASSWORD, BIRTH_DATE, CITY, LANGUAGES, INSTRUMENTS, ADDRESS, MUSICAL_GENRE, MUSICAL_EXPERIENCE, BAND_ID, DESCRIPTION, YOUTUBE_LINK) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
    const values = [userData.PHONE, userData.NAME, userData.GENDER, userData.EMAIL, userData.PASSWORD, userData.BIRTH_DATE, userData.CITY, userData.LANGUAGES, userData.INSTRUMENTS, userData.ADDRESS, userData.MUSICAL_GENRE, userData.MUSICAL_EXPERIENCE, userData.BAND_ID, userData.DESCRIPTION, userData.YOUTUBE_LINK];
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
    throw new Error('Erro ao buscar usuário por ID: ' + error.message);
  }
}

module.exports = {
  insertUser, getUsers, searchById, login
};