const axios = require('axios');
const { EventEmitter } = require('events');

class Client extends EventEmitter {
  /**
   * Initializes the Client.
   * @param {String} hash Your authorization hash token, found on the site under "Account Details".
   */
  constructor(hash) {
    super();
    this._hash = hash;
    this._init();
  }
  /**
    * Private async function that inits the client.
    * @private
    * @returns Promise<void>
    */
  async _init() {
    this._username = await this.getInfo('username');
    this._id = await this.getInfo('id');
    this._email = await this.getInfo('email');
    this._class = await this.getInfo('class');
    this._total = await this.getInfo('total');
    this._allowed = await this.getInfo('allowed');
    this._promo = await this.getInfo('promo');
    this._usedPromoKeys = await this.getInfo('usedPromoKeys');
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

  async getInfo(request) {
    const method = await axios({
      method: 'get',
      url: 'https://api.securesign.org/account/details',
      headers: {'Authorization': this._hash}
    });

    return method.data.message[request];
  }

  /**
   * Generates a new ECC/RSA private key.
   * @param {String} type 
   * @param {String | Number} info For a ECC key, specify the curve name. RSA specify the modulus.
   * @example Client.generateKey('ECC', 'prime256v1').then(r => console.log(r)).catch(e => console.error(e));
   */
  async generateKey(type, info) {
    if (!type) throw new Error('Must specify whether creating an ECC or RSA key.');
    if (!info) throw new Error('Must provide either a curve for an ECC key, or a modulus number for an RSA key.');
    if (type !== 'ECC' && type !== 'RSA') throw new Error('Type must be either ECC or RSA.');
    if (type === 'ECC') {
      const method = await axios({
        method: 'post',
        url: 'https://api.securesign.org/keys/ecc',
        headers: {'authorization': this._hash, 'Content-Type': 'application/json'},
        data: JSON.stringify({curve: info})
      });

      return method.data.message;
    } else if (type === 'RSA') {
      const method = await axios({
        method: 'post',
        url: 'https://api.securesign.org/keys/rsa',
        headers: {'authorization': this._hash, 'Content-type': 'application/json'},
        data: JSON.stringify({modulus: info})
      });

      return method.data.message;
    } else {
      throw new Error('Something went wrong.');
    }

  }

  /**
   * Provides a list of available ECC named curves.
   * @example Client.listCurves().then(r => console.log(r)).catch(e => console.error(e));
   */
  async listCurves() {
    const method = await axios({
      method: 'get',
      url: 'https://api.securesign.org/keys/ecc',
      headers: {'authorization': this._hash}
    });

    return method.data.message;
  }

  /**
   * Provides an array of objects, in each object is certificate information for each certificate you have created.
   * @example Client.listCerts(r => console.log(r[0])).catch(e => console.error(e));
   */
  async listCerts() {
    const method = await axios({
      method: 'get',
      url: 'https://api.securesign.org/certificates',
      headers: {'authorization': this._hash}
    });

    return method.data.message;
  }

  /**
   * Creates a new certificate.
   * @param {Number} classNum The class used to make the certificate. Class 1-2 are supported on ECC, all classes are supported with RSA.
   * @param {String} cn The Common Name of the certificate.
   * @param {String} md The Hashing Algorithm to use for the certificate, can be SHA256, SHA384, or SHA512.
   * @param {String} type The CA key type to use, can be ECC or RSA.
   * @param {String} csr The PEM-encoded CSR.
   * @example Client.createCert(2, 'matthew<at>cloud.libraryofcode.us', 'SHA512', 'ECC', fs.readFileSync('/path/to/my.csr')).then(r => console.log(r)).catch(e => console.error(e));
   */
  async createCert(classNum, cn, md, type, csr) {
    try {
    if (!classNum) throw new Error('The cert\'s class must be specified.');
    if (!cn) throw new Error('The cert\'s commonname must be specified.');
    if (!md) throw new Error('The cert\'s Signature Hash Algorithm must be specified.');
    if (!type) throw new Error('The cert\'s key type must be specified. Either ECC or RSA.');
    if (type !== 'ECC' && type !== 'RSA') throw new Error('The key type must either be ECC or RSA.');
    if (!csr) throw new Error('The cert\'s CSR must be specified.');
    if (classNum !== 1 && classNum !== 2 && classNum !== 3) throw new Error('The certificate must have either class 1, 2, or 3.');
    if (md !== 'SHA256' && md !== 'SHA384' && md !== 'SHA512') throw new Error('The certificate\'s signature hash algorithm must be either SHA256, SHA384, or SHA512');
    if (classNum === 1) {
      const method = axios({
        method: 'post',
        url: `https://api.securesign.org/certificates/${type}/client?class=1`,
        headers: {'authorization': this._hash, 'Content-Type': 'application/json'},
        data: JSON.stringify({
          commonname: cn,
          md: md,
          csr: csr
        })
      });

      return method.data.message;
    } else if (classNum === 2) {
      const method = axios({
        method: 'post',
        url: `https://api.securesign.org/certificates/${type}/client?class=2`,
        headers: {'authorization': this._hash, 'Content-Type': 'application/json'},
        data: JSON.stringify({
          commonname: cn,
          md: md,
          csr: csr
        })
      });

      return method.data.message;
    } else if (classNum === 3) {
      if (type !== 'RSA') throw new Error('Only RSA keys support class 3 certificates.');
      const method = axios({
        method: 'post',
        url: 'https://api.securesign.org/certificates/rsa/client?class=3',
        headers: {'authorization': this._hash, 'Content-Type': 'application/json'},
        data: JSON.stringify({
          commonname: cn,
          md: md,
          csr: csr
        })
      });

      return method.data.message;
    } else {
      throw new Error('Something went wrong!');        
    } 
  } catch {
    console.log(error.response);
  }
  }


}

module.exports = Client;
