const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    // 1. استخراج الرابط من المسار (إزالة الـ / الأولى)
    const targetUrl = req.url.slice(1);

    // 2. التحقق من أن الرابط هو رابط فعلي
    if (!targetUrl.startsWith('http')) {
        res.writeHead(200);
        res.end('السيرفر يعمل. يرجى إرسال الطلبات بهذا التنسيق: /https://site.com');
        return;
    }

    console.log(`توجيه إلى: ${targetUrl}`);

    // 3. التوجيه الديناميكي
    proxy.web(req, res, {
        target: targetUrl,
        changeOrigin: true,
        secure: false,
        headers: {
            'Host': 'm.facebook.com' // الهيدر الذي تريده
        }
    }, (err) => {
        console.error('خطأ:', err);
        res.writeHead(502);
        res.end('خطأ في الاتصال بالوجهة');
    });
});

server.listen(8080);