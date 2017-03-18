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
Database should be already created; don't run server at the same time
```
npm test
```


### Deployed
http://link.excur.info
