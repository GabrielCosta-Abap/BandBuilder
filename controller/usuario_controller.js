const oNegocioUsuario = require('../negocio/usuario_negocio')

module.exports = {

    getUsuarios: async (req, res) => {

        console.log('chegou no controller')

        try {

            const usuarios = await oNegocioUsuario.getUsuarios();
            res.status(200).json(usuarios)

        } catch (error) {

            if (error && error.code) {
                res.status(error.code).send(error.message);
            } else {
                res.status(500).send('deu pau na chamada da Api')
            }

        }
    }

}