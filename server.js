var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号，如： \nnode server.js 8888 ')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method



    console.log('路径（带查询参数）：' + pathWithQuery)


    response.statusCode = 200

    const filepath = path === '/' ? '/index.html' : path;
    let content;
    try {
        content = fs.readFileSync(`public${filepath}`);
    } catch (error) {
        content = "「你访问的页面不存在」";
        response.statusCode = 404;
    }

    let index = filepath.lastIndexOf('.');
    let suffix = filepath.substring(index);

    let filetypes = {
        '.css': 'text/css',
        '.js': 'text/JavaScript',
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.json': 'text/json'
    }
    response.setHeader('Content-Type', `${filetypes[suffix] || 'text / html'};charset=utf-8`)

    response.write(content)
    response.end()


})

server.listen(port)
console.log('监听 ' + port + ' 成功\n  http://localhost:' + port)
