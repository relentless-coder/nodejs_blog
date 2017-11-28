# nodejs-native-rest-apis [![Build Status](https://travis-ci.org/relentless-coder/wingify-sample.svg?branch=master)](https://travis-ci.org/relentless-coder/wingify-sample)

## About
This is my attempt at writing CRUD REST APIs in native nodejs, by using minimum number of third party modules. I think I succeeded upto a extent. It uses only four third party modules: [mongodb-nodejs-driver](https://mongodb.github.io/node-mongodb-native/) [router](https://github.com/pillarjs/router) [multer](https://github.com/expressjs/multer) and [moment-timezone](http://momentjs.com/timezone/).

Tools required:

* Nodejs > 8.x
* yarn
* mongodb

Steps to setup:

1. Clone the repository from [wingify-sample](https://github.com/relentless-coder/wingify-sample.git)
2. Run `yarn install`

The code is written in ES6, so you need to transpile the code by running the command `yarn run build`.

Test command is: `yarn test`; **Note: You have to transpile the code in order to run the tests.**

To run the application: `yarn start`

Contact: contact@ayushbahuguna.com
