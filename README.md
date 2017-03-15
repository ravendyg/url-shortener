## URL shortener

Test resource to create short URLs and redirect using them

### External dependencies
Nodejs ^6.10.0

MySQL 5.7 (5.6 definitely should work, guess smth with lower version would also do, but didn't test).


### Setup

Create the database and the user
```
create database <db name>;

create user '<user name>'@'localhost' identified by '<password goes here>';

GRANT ALL ON <db name>.* TO '<user name>'@'localhost';
```

Populate config.json (find example.config.json) - DB setup

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