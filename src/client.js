const axios = require('axios');
const { EventEmitter } = require('events');

class Client extends EventEmitter {
    constructor(hash) {
        super();
        this._hash = hash;
        this._username = this.getInfo('username');
        this._id = this.getInfo('id');
        this._email = this.getInfo('email');
        this._class = this.getInfo('class');
        this._total = this.getInfo('total');
        this._allowed = this.getInfo('allowed');
        this._promo = this.getInfo('promo');
        this._usedPromoKeys = this.getInfo('usedPromoKeys');
        this.emit('ready', this);
    }

    get hash() {
        return this._hash;
    }
    get username() {
        return this._username;
    }
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
    get class() {
        return this._class;
    }
    get total() {
        return this._total;
    }
    get allowed() {
        return this._allowed;
    }
    get promo() {
        return this._promo;
    }
    get usedPromoKeys() {
        return this._usedPromoKeys;
    }

    getInfo(request) {
        axios({
            method: 'get',
            url: 'https://api.securesign.org/account/details',
            headers: {'Authorization': this._hash}
        }).then(r => r.data.message[request]);
    }
}

module.exports = Client;