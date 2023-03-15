const crypto = require('crypto');

module.exports = {
    makeId:(byteLength)=>{
        const id = crypto.randomBytes(byteLength).toString('hex');
        return id;
    }
}