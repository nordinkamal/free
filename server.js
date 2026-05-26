const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    // 1. استخراج الوجهة الأصلية من رابط الطلب
    const targetUrl = req.url.substring(1); 

    // 2. تصحيح الـ Host قبل إرساله للموقع الحقيقي
    // (لأن الموقع لن يفهمك إذا أرسلت له "فيسبوك" وأنت تطلب "جوجل")
    const originalHost = new URL(targetUrl).hostname;
    req.headers['Host'] = originalHost;

    console.log(`تم تصحيح الـ Host إلى: ${originalHost}`);

    // 3. إعادة التوجيه للوجهة الحقيقية
    proxy.web(req, res, {
        target: targetUrl,
        changeOrigin: true,
        secure: false
    }, (err) => {
        res.writeHead(502);
        res.end('خطأ في الاتصال');
    });
});

// 4. تعديل الرد قبل إرساله لك (تغيير الـ Host في الرد)
proxy.on('proxyRes', (proxyRes, req, res) => {
    proxyRes.headers['Host'] = 'm.facebook.com';
});

server.listen(3000);