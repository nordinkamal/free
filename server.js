const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    // 1. نقطة فحص (Health Check)
    // إذا فتح المستخدم الرابط الرئيسي للبروكسي بدون إرسال موقع
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>السيرفر يعمل بنجاح! ✅</h1><p>البروكسي جاهز لاستقبال طلباتك.</p>');
        return;
    }

    // 2. استخراج الوجهة الأصلية
    let targetUrl = req.url.substring(1); 
    
    if (!targetUrl.startsWith('http')) {
        res.writeHead(400);
        res.end('خطأ: الرابط يجب أن يبدأ بـ http أو https');
        return;
    }

    console.log(`جارٍ التوجيه إلى: ${targetUrl}`);

    // 3. التوجيه
    proxy.web(req, res, {
        target: targetUrl,
        changeOrigin: true,
        secure: false
    }, (err) => {
        console.error('خطأ في البروكسي:', err.message);
        if (!res.headersSent) {
            res.writeHead(502);
            res.end('فشل في الوصول للوجهة');
        }
    });
});

// إضافة سجل عند التشغيل
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`السيرفر يعمل الآن على المنفذ: ${port}`);
});