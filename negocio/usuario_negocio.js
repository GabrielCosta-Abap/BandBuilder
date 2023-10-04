const oPersistencia = require('../persistencia/usuario_persistencia')

module.exports = {

    getUsuarios: async ()=>{
        console.log('chegou no negócio')

        return await oPersistencia.getUsuarios();
    }

}