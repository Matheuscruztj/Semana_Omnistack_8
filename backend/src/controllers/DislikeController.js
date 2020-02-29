const Dev = require('../models/Dev');
const verifica = require('mongoose');

module.exports = {
    async store(req, res){
        const { user } = req.headers;
        const { devId } = req.params;

        if(!verifica.Types.ObjectId.isValid(devId)){
            return res.status(400).json({ error : 'Dev not exists' });
        }
        
        const loggedDev = await Dev.findById(user).maxTimeMS(10000);
        const targetDev = await Dev.findById(devId);

        if(!targetDev){
            return res.status(400).json({ error : 'Dev not exists' });
        }

        loggedDev.dislikes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
};