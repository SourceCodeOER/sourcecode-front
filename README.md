# Source Code - front-end

> The new open source catalog of computer exercises

## What is the meaning of this project ?

Like _Open Educational Resources_, *Source Code* offers educational teams the opportunity to collaborate on the issue of creating and sharing exercises. The latter consists of referencing IT resources, allowing a diverse audience to benefit from all contributions.

## Before the setup !!

This application works with a **database and an API**. This provided by the 
[Source Code API](https://github.com/SourceCodeOER/sourcecode_api) repo.

In order to build the setup for this project, you must ensure that you follow all the [steps](https://github.com/SourceCodeOER/sourcecode_api#set-up) in the `Source Code API`.

To make **Source Code** works, you must enable the databases and run the application of the back-end part !

## Requirements

- [NodeJS](https://nodejs.org/en/) (at least v10)
- That's all folks !

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3333
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
The core of this project is based on Nuxt.js to boost the app in the client side.
For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Integration testing & E2E testing

We use [Cypress](https://www.cypress.io) as the framework to test the application. Enter the following command to run Cypress and get the interface.

``` bash
$ npm run cypress:open
```
