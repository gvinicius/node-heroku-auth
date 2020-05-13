# Node Heroku Auth

This application is jwt auth based on heroku node example, for being used as auth and stories payload
storage for many microservice-architectural apps

Fill the .env file for production and .env.development according to your targeted environment
variables.

Node version: 12.3.0

Npm version: 6.14.5

Install packages:
    $ npm i

Install nodemon for hot reload express:
    $ npm install nodemon -g

Run tests with jest using the following command:
    $ npm test

Run linter:
    $ npm run-script lint

Configure mongo. Docker alpine container suggested:
    $ docker run -d --name mongo -p 27017:27017 \
	  -v /somewhere/onmyhost/mydatabase:/data/db \
	  mvertes/alpine-mongo

If you need, to use the mongo shell client:
    $ docker exec -ti mongo mongo
