const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8'
};

// Prevent server from crashing under any circumstances
process.on('uncaughtException', (err) => {
    console.error('Server Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = http.createServer((req, res) => {
    // Add Vercel-compatible helper methods for serverless handlers
    res.status = function (statusCode) {
        res.statusCode = statusCode;
        return {
            json: function (data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            },
            send: function (data) {
                res.end(data);
            }
        };
    };

    // Enable CORS and disable caching during development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Handle /api/blogs endpoint locally
    if (pathname === '/api/blogs' || pathname === '/api/blogs.js') {
        try {
            delete require.cache[require.resolve('./api/blogs.js')];
            const blogsApi = require('./api/blogs.js');
            return blogsApi(req, res);
        } catch (e) {
            console.error('API Error:', e);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: e.message }));
            }
        }
        return;
    }

    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    const filePath = path.join(PUBLIC_DIR, pathname);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('Access Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family:sans-serif;background:#09090b;color:#ffffff;padding:40px;text-align:center;">
                    <h1>404 - Page Not Found</h1>
                    <p>The requested URL <code>${pathname}</code> was not found.</p>
                    <p><a href="/" style="color:#ffffff;">Go back to Home</a></p>
                </body>
                </html>
            `);
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Development server running continuously at http://localhost:${PORT}/`);
});
