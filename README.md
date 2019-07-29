# SecureSign.js
SecureSign.js is a library developed by Knight for [Library of Code's](https://www.libraryofcode.us/) securesign API! SecureSign.js will allow you to easily manage the API. SecureSign.js provides full accessability when it comes to what it can do. Everything documented on the securesign API is included in SecureSign.js. SecureSign.js is still being constantly updated.

## Installation

To install SecureSign.js, just run `npm i securesign.js` in your terminal.

## Getting Started

To get started with SecureSign.js, you need to initialize your client. Do this this, simply do:

```javascript
const secureSign = require('securesign.js');
const Client = new secureSign.Client('yourHash');
```

Once you have this, it is highly recommended you run the ready event. The callback function inside the ready event will fire when the client has been fully initialized. Without the use of the ready event, you could run into errors due to the client not being quite ready yet. To run the ready event, simply do:

```javascript
Client.on('ready', (info) => {
  //Your callback function goes here.
  console.log(`${info.username} is ready!`);
});
```

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

