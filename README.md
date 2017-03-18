## URL shortener

Test resource to create short URLs and redirect using them.

#### Server
Somewhat barebone nodejs without beloved express framework. Cool attempt to reinvent it myself, alas miserably failed.

#### Client
Tryed some new hipster stuff:
- webpack 2 - small decrease in bundle size (cool), production build out of the box without painful plugins setup (also cool) but makes me feel like I'm loosing control on it (not so cool).
- preact - first made with traditional (what a time!, I call it traditional) react, got 162Kb. With preact it went down to 46Kb! Unfortunately couldn't make it work on it's own, had to use prect-compat. But so far it looks great anyway.

### External dependencies
Nodejs ^6.10.0

MySQL 5.7 (5.6 definitely should work, guess smth with ф lower version would also do, but didn't test).


### Setup

Create the database and the user
```
create database <db name>;

create user '<user name>'@'localhost' identified by '<password goes here>';

GRANT ALL ON <db name>.* TO '<user name>'@'localhost';
```

Populate config.json (find example.config.json) - DB setup

Also add property HOST - where the app has been deployed (by default it's localhost + PORT). Could be passed from client side, but in case different domain is used.

Instal dependencies
```
npm i
```

#### Remote DB
If you have a database on a remote server or just looking for some fun. Then replace 'localhost' (in db setup and config.json) with server ip or host name. Without http:// !. The latter would be resolved to ip. Overwrite DB_PORT in config (if you have it different from the default 3306 or use port forwarding).

In my case (I've got a server behind a router) it looks like this
```
create user '<user name>'@'192.168.1.1' identified by '<password goes here>';
GRANT ALL ON <db name>.* TO '<user name>'@'192.168.1.1';

"DB_HOST": "excur.info" // have several domains pointing to the same ip
"DB_PORT": <router db port>
```
And the router is set up to forward requests from "router db port" to 3306 on the server.

Don't forget to remove default MySQL bind to 127.0.0.1 And REMEMBER that by doing this you would open your vulnerable database to the cruel world of the internet!


### Build client app
```
npm run build         // development

npm run build:prod    // production
```


### Run server
```
npm start
```

or (using pm2)

```
pm2 start process.json
```


### Tests
Database should be already created;
Default port - 3036
```
npm test
```


### Deployed
http://link.excur.info
