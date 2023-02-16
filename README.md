## Ballers (BACKEND)

## Description

* Gaming Portal - Reward withdrawal portal.
* This project is an Express backend for a web application.
* This project was created with [EXPRESS SERVER](https://github.com/expressjs/express) version ^4.16.3.
## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:
Git - Download & Install Git. OSX and Linux machines typically have this already installed.
Version 2.33.0.
Node.js - Download & Install Node.js and the npm package manager. If you encounter any problems, you can also use this GitHub Gist to install Node.js.
Version 14.17.6
MongoDB - Download & Install MongoDB, and make sure it's running on the default port (27017)
Version MongoDB 4.4

## Version 0.0.1

View Current & Previous Versions details [linky](./VERSIONS.md)

## Get Started

Get started developing...

```shell
# clone backend in your local system
git clone git@bitbucket.org:4321r/ballers-backend.git

#Latest branch
git checkout feature/claim-pot-tokens
# install deps
npm install
# run in development mode
npm start
```

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Insert Seed data

Insert predefined seed data (one time operation)

```shell
npm run seeds
```

## Run It

#### Run in *development* mode:

Runs the application is development mode. Should not be used in production

```shell
npm start
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
NODE_ENV=production npm start
```

## Documentation

* Open you're browser to [https://testapi.recru.in](https://testapi.ballers.in)
* Run api described in swagger doc
* Invoke the `/examples` endpoint
  ```shell
  curl https://testapi.ballers.in/api/v1/examples
  ```

## Config

* find all pre-dependencies in config folder
* Change the Following domain settings as per requirements
  CLIENT_URL
  EMAIL_HOST
  IMAGE_PATH

## Authors

* ITH Technologies
