const http = require('http');
const httpProxy = require('http-proxy');

// إنشاء بروكسي مع تجاهل أخطاء الـ SSL
const proxy = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true
});

const server = http.createServer((req, res) => {
    // 1. استخراج الرابط من الهيدر
    const targetUrl = req.headers['x-target-url'];

    // 2. التحقق من وجود الرابط
    if (!targetUrl || !targetUrl.startsWith('http')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>السيرفر يعمل بنجاح! ✅</h1>');
        return;
    }

    console.log(`توجيه الطلب إلى: ${targetUrl}`);

    // 3. التوجيه الديناميكي
    proxy.web(req, res, {
        target: targetUrl,
        // changeOrigin: true تضمن تغيير الـ Host ليطابق الوجهة (جوجل)
        // وبذلك تتجنب تضارب الهيدرات
    }, (err) => {
        console.error('خطأ في البروكسي:', err.message);
        if (!res.headersSent) {
            res.writeHead(502);
            res.end('فشل الاتصال بالوجهة');
        }
    });
});

// التعامل مع أخطاء البروكسي العامة لمنع توقف السيرفر
proxy.on('error', (err, req, res) => {
    console.error('حدث خطأ في البروكسي:', err);
    if (!res.headersSent) {
        res.writeHead(502);
        res.end('خطأ داخلي في البروكسي');
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`السيرفر يعمل الآن على المنفذ: ${port}`);
});