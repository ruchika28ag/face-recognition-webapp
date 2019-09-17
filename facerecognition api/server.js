const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'ruchika',
    password : '',
    database : 'smart-brain'
  }
});

const app= express();

const database={
	users: [
		{
			'id': '123',
			'name': 'John',
			'email': 'john@gmail.com',
			'password': 'cakes',
			'entries': 0,
			'joined': new Date()
		},
		{
			'id': '124',
			'name': 'Sally',
			'email': 'sally@gmail.com',
			'password': 'chips',
			'entries': 0,
			'joined': new Date()
		}
	],
	login: [
	{
		'id': '987',
		'hash': '',
		'email': 'john@gmail.com'
	}
	]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=>{	res.json(database.users)	})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', image.handleApiCall())

app.listen(process.env.PORT || 3000, ()=>{
	console.log(`the app is running on port ${process.env.PORT}`);
})