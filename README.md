## URL shortener

Test resource to create short URLs and redirect using them

### External dependencies
Nodejs 6.0.0 and above

MySQL 5.7 (5.6 definitely should work, guess smth with lower version would also do).


### Setup

Create the database and the user
```
create database link_test;

create user 'link_test'@'localhost' identified by '<password goes here>';

GRANT ALL ON link_test.* TO 'link_test'@'localhost';
```

Populate config.json (find example.config.json) - DB setup

Instal dependencies
```
npm i
```


### Run
```
npm start
```

or (using pm2)

```
pm2 start process.json
```