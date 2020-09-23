const http = require('http')
const url = require('url')
const qs = require('querystring')

const users = {
  allen: '123456',
  tom: '123456',
  henry: '123456',
  selby: '123456',
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
  })
  if (req.method === 'GET') {
    handleGet(pathname, query, req, res)
  }
  if (req.method === 'POST') {
    let buffer = ''
    req.on('data', chunk => {
      buffer += chunk
    })
    req.on('end', () => {
      handlePost(pathname, buffer, req, res)
    })
  }

  function handleGet(pathname, query, req, res) {
    if (pathname === '/login') {
      console.log('enter login')
      handleLogin(query, req, res)
    }
  }

  function handlePost(pathname, buffer, req, res) {
    if (pathname === '/register') {
      handleRegister(buffer, req, res)
    }
  }

  function handleLogin(query, req, res) {
    const { username, password } = query
    if (!users[username]) {
      res.end(
        JSON.stringify({
          err: 1,
          msg: '用户名不存在',
        })
      )
    } else if (users[username] !== password) {
      res.end(
        JSON.stringify({
          err: 2,
          msg: '密码错误',
        })
      )
    } else {
      res.end(
        JSON.stringify({
          err: 0,
          msg: '登录成功',
        })
      )
    }
  }

  function handleRegister(buffer, req, res) {
    console.log('enter register')
    const json = qs.parse(buffer)
    const { username, password } = json
    if (users[username]) {
      res.end(
        JSON.stringify({
          err: 1,
          msg: '账户已存在',
        })
      )
    } else {
      users[username] = password
      console.log('users', users)
      res.end(
        JSON.stringify({
          err: 0,
          msg: '注册成功',
        })
      )
    }
  }
})

const port = 8081
server.listen(port, () => {
  console.log(`Server listening on ${port} port`)
})
