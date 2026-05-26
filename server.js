const http = require('http');
const httpProxy = require('http-proxy');
const { URL } = require('url');

const proxy = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true
});

const server = http.createServer((req, res) => {
    const targetUrl = req.headers['x-target-url'];

    if (!targetUrl || !targetUrl.startsWith('http')) {
        res.end('السيرفر يعمل');
        return;
    }

    // استخراج الهوست من الرابط الهدف ليتم استخدامه في الطلب
    const target = new URL(targetUrl);
    
    proxy.web(req, res, {
        target: targetUrl,
        headers: {
            'Host': target.host
        }
    });
});

proxy.on('proxyRes', (proxyRes, req, res) => {
    // تغيير الهوست في الرد ليكون m.facebook.com كما طلبت
    proxyRes.headers['host'] = 'm.facebook.com';
});

server.listen(3000);