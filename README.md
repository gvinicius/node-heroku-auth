# node-auth

This application is jwt auth based on heroku node example, for being used as auth and payload storage for many microservice-architectural apps

Fill the .env file for production and .env.development according to your targeted environment
variables.

Node version: 12.3.0
Npm version: 6.13.7

Install packages:
$ npm i

Run nodemon for hot reload express:
    $ npm install nodemon -g

Configure mongo:

    $ docker run -d --name mongo -p 27017:27017 \
	  -v /somewhere/onmyhost/mydatabase:/data/db \
	  mvertes/alpine-mongo

To use the mongo shell client:

	$ docker exec -ti mongo mongo
