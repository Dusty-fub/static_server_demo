const express = require('./express');

let app = express();

app.get('/',(req,res)=>{
	res.end('hello world')
})

app.post('/',(req,res)=>{
	res.end('post name')
})

app.all('*',(req,res)=>{
	res.end('all')
})

app.listen(3000,()=>{
	console.log('server start at http://localhost:3000')
})