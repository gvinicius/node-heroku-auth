# node-auth

Configure install nodemon for hot reload express:
    $ npm install nodemon -g

Configure mongo:

    $ docker run -d --name mongo -p 27017:27017 \
	  -v /somewhere/onmyhost/mydatabase:/data/db \
	  mvertes/alpine-mongo

To use the mongo shell client:

	$ docker exec -ti mongo mongo
