const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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

app.get('/', (req, res)=>{
	res.json(database.users);
})

app.post('/signin', (req, res)=>{
	if(req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res)=>{
	const { name, email, password}= req.body;
	database.users.push({
		'id': '125',
		'name': name,
		'email': email,
		'entries': 0,
		'joined': new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res)=>{
	const{id} = req.params;
	let found= false;
	database.users.forEach(user =>{
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	});
	if(!found){
		res.status(404).json('no such user');
	}
})

app.put('/image', (req, res)=>{
	const{id} = req.body;
	let found= false;
	database.users.forEach(user =>{
		if(user.id === id){
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if(!found){
		res.status(404).json('no such user');
	}
})

app.listen(3000, ()=>{
	console.log('the app is running.');
})



/*
/ --> res=this is working
/signin --> POST= success/fail
/register --> POST = user
/profile/:userID --> GET = user
/image --> PUT = user
*/