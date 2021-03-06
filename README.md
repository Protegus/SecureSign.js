# THIS LIBRARY IS NO LONGER WORKING! THE SECURESIGN API HAS BEEN DISCONTINUED. FOR SUPPORT, GO TO [Library of Code](https://www.libraryofcode.org/)!

# SecureSign.js
SecureSign.js is a library developed by Knight for [Library of Code's](https://www.libraryofcode.org/) securesign API! SecureSign.js will allow you to easily manage the API. SecureSign.js provides full accessability when it comes to what it can do. Everything documented on the securesign API is included in SecureSign.js. SecureSign.js is still being constantly updated.

## Installation

To install SecureSign.js, just run `npm i securesign.js` in your terminal.

## Getting Started

To get started with SecureSign.js, you need to initialize your client. Do this this, simply do:

```javascript
const secureSign = require('securesign.js');
const Client = new secureSign.Client('yourHash');
```

> Your hash can be found under "Account Details" at the [Securesign website.](https://www.securesign.org) It is recommended that you do not share your hash, keep it in a configuration file or .env file. 

Once you have this, it is highly recommended you run the ready event. The callback function inside the ready event will fire when the client has been fully initialized. Without the use of the ready event, you could run into errors due to the client not being quite ready yet. To run the ready event, simply do:

```javascript
Client.on('ready', (info) => {
  //Your callback function goes here.
  console.log(`${info.username} is ready!`);
});
```

>The parameter for the callback, info, is literally the exact same thing as Client... It's your choice whether to use it or not.

# Documentation

## Information attached to client

Name | Description | Example
---- | ----------- | -------
hash | Will return the hash you used to initialize the client | `Client.hash`
username | Will return the username of your securesign account | `Client.username`
id | Will return the ID of your securesign account | `Client.id`
email | Will return the email of your securesign account | `Client.email`
class | Will return the class of your securesign account | `Client.class`
total | Will return the total amount of certificates created under your account | `Client.total`
allowed | Will return the total amount of certificates allowed to be issued under your account | `Client.allowed`
promo | Will return a boolean whether or not you have promo's activated...(I think) | `Client.promo`
usedPromoKeys | Will return an array of all the used promo keys under your account | `Client.usedPromoKeys`

## Functions attached to client

### generateKey()

This function will generate a new ECC/RSA private key.

> Returns `String`

Parameters | Description | Type
---------- | ----------- | ----
type | ECC or RSA | `String`
info | For a ECC key, specify the curve name. RSA specify the modulus. | `String or Number`

#### Example

```javascript
Client.generateKey('ECC', 'prime256v1').then(r => console.log(r)).catch(e => console.error(e));
```

### listCurves()

This function provides a list of available ECC named curves.

> Returns `String`

> No parameters.

#### Example

```javascript
Client.listCurves().then(r => console.log(r)).catch(e => console.error(e));
```

### listCerts()

This function provides an array of objects, in each object is certificate information for each certificate you have created.

> Returns `Array`

> No parameters

#### Example

```javascript
Client.listCerts().then(r => console.log(r)).catch(e => console.error(e));
```

### createCert()

This is currently the most complex function. This function creates a new certificate.

> Returns `certificate object`

> For information on a `certificate object`, please visit [this link!](https://docs.cloud.libraryofcode.us/?javascript#generate-class-1-certificate)

Parameters | Description | Type
---------- | ----------- | ----
classNum | The class used to make the certificate. Class 1-2 are supported on ECC, all classes are supported with RSA. | `Number`
cn | The Common Name of the certificate. | `String`
md | The Hashing Algorithm to use for the certificate, can be SHA256, SHA384, or SHA512. | `String`
type | The CA key type to use, can be ECC or RSA. | `String`
csr | The PEM-encoded CSR. You want to provide the path to CSR and it'll be read automatically by the library. | `String`

#### Example 

```javascript
Client.createCert(2, 'matthew@cloud.libraryofcode.us', 'SHA512', 'ECC', fs.readFileSync('/path/to/my.csr', {encoding: 'utf8'})).then(r => console.log(r)).catch(e => console.error(e));
```

> Make sure for the path to the CSR you add utf8 encoding. Otherwise it will not work.
