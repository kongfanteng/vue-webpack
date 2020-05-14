let http = require('http');
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const sendMail = require('./sendMail');
const SECRET = '123';
function sign(data) {
  return 'sha1=' + crypto.createHmac('sha1', SECRET).update(data).digest('hex');
}
let server = http.createServer(function (req, res) {
  console.log(req.method, req.url);
  if (req.url == '/webpack' && req.method == 'POST') {
    let buffers = [];
    req.on('data', function (data) {
      buffers.push(data);
    })
    req.on('end', function () {
      let body = Buffer.concat(buffers);
      let signature = req.headers['x-hub-signature'];
      let event = req.headers['x-github-event'];
      let id = req.headers['x-github-delivery'];
      if (signature !== sign(body)) {
        res.statusCode = 404;
        return res.end('Not Allowed');
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ "ok": true }));
      console.log(event);
      if (event === 'push') {
        let payload = JSON.parse(body);
        let child = spawn('sh', [`./${payload.repository.name}`.sh]);
        let buffers = [];
        child.stdout.on('data', function (buffer) {
          buffers.push(buffer);
        })
        child.stdout.on('end', function () {
          let logs = Buffer.concat(buffers).toString();
          console.log(logs);
          sendMail(`
            <h1>
              <h2>部署日期：${new Date()}</h2>
              <h2>部署人：${payload.pusher.name}</h2>
              <h2>部署邮箱：${payload.pusher.email}</h2>
              <h2>提交信息：${payload.head_commit && payload.head_commit['message']}</h2>
              <h2>提交日期：${logs.replace("\r\n", '<br/>')}</h2>
            </h1>
          `)
        })
      }
    })
  } else {
    res.end('Not Found')
  }
})
server.listen(5000, () => {
  console.log('5000端口启动');
})