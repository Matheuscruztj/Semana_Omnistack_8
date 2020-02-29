const Dev = require('../models/Dev');
const verifica = require('mongoose');

module.exports = {
    async store(req, res){
        // console.log( req.io, req.connectedUsers );
        
        const { user } = req.headers;
        const { devId } = req.params;

        if(!verifica.Types.ObjectId.isValid(devId)){
            return res.status(400).json({ error : 'Dev not exists' });
        }
        
        const loggedDev = await Dev.findById(user).maxTimeMS(10000);
        const targetDev = await Dev.findById(devId);

        if( !targetDev){
            return res.status(400).json({ error : 'Dev not exists' });
        }

        if(targetDev.likes.includes(loggedDev._id)){

            // console.log('aaaaaaa');

            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            //se o usuario que deu o like tiver logado
            if (loggedSocket){
                req.io.to( loggedSocket ).emit( 'match', targetDev );
            }
            //se o alvo estiver logado
            if (targetSocket){
                req.io.to( targetSocket ).emit( 'match', loggedDev );
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
};