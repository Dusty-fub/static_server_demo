const http = require('http')
const url = require('url')

function createApp(){

	let app = (req,res)=>{

		let reqMethod = req.method.toLowerCase();
		let {pathname} = url.parse(req.url,true)

		app.routes.map((layer)=>{
			let {method,path,handler} = layer;
			if((method === reqMethod || method === 'all') && (path === pathname || path ==='*')){
				handler(req,res);
			}
		})

		res.end(`cannot ${reqMethod} ${pathname}`)
	}

	app.routes = []

	app.all = (path,handler)=>{
		let layer = {
				method:'all',
				path,
				handler
			}
		app.routes.push(layer)
	}

	http.METHODS.forEach((method)=>{
		method = method.toLowerCase();
		app[method]= function(path,handler){
			let layer = {
				method,
				path,
				handler
			}
			app.routes.push(layer)
		}
	})

	app.listen = function(){
		let server = http.createServer(app)
		server.listen(...arguments)
	}

	return app
}

module.exports = createApp;

