
const { conexao } = require('./conexao');
const { Client } = require('pg');

module.exports = {

    getUsuarios: async () => {

        console.log('chegou na persistencia')

        const client = new Client(conexao);
        let res;        

        console.log('antes do connect')
        await client.connect();
        console.log('depois do connect')

        let sQuery = 'SELECT * FROM usuarios';

        try {

            console.log('só falta conectar mesmo')

            res = await client.query(sQuery);
            console.log(res)

        } catch (error) {

            throw { code: 500, message: error };

        }

        await client.end();
        return res.rows;

    }
}