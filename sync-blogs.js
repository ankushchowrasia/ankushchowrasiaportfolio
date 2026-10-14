const fs = require('fs');

async function main() {
    try {
        const res = await fetch('https://ankushchowrasia1.blogspot.com/feeds/posts/default?alt=json&max-results=100');
        const data = await res.json();
        const entries = data.feed.entry || [];
        console.log('Total entries fetched:', entries.length);

        function normalizeUnicodeText(str) {
            if (!str) return '';
            return str
                .replace(/[\uD835][\uDC00-\uDFFF]/g, (char) => {
                    const code = char.codePointAt(0);
                    if (code >= 0x1D400 && code <= 0x1D419) return String.fromCharCode(code - 0x1D400 + 65);
                    if (code >= 0x1D41A && code <= 0x1D433) return String.fromCharCode(code - 0x1D41A + 97);
                    if (code >= 0x1D7CE && code <= 0x1D7D7) return String.fromCharCode(code - 0x1D7CE + 48);
                    return char;
                })
                .replace(/[\u2013\u2014]/g, '-');
        }

        function formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        const blogs = entries.map(entry => {
            const rawTitle = entry.title && entry.title.$t ? entry.title.$t : 'Untitled';
            const title = normalizeUnicodeText(rawTitle);
            const rawContent = entry.content && entry.content.$t ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
            const publishedISO = entry.published && entry.published.$t ? entry.published.$t.split('T')[0] : '2026-01-01';
            const publishedDate = entry.published && entry.published.$t ? formatDate(entry.published.$t) : '2026';

            let thumbnail = '';
            if (entry.media$thumbnail && entry.media$thumbnail.url) {
                thumbnail = entry.media$thumbnail.url.replace(/=s\d+(-c)?$/, '=w800');
            } else {
                const imgMatch = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
                thumbnail = imgMatch ? imgMatch[1] : 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-03%20124122.png';
            }

            const rawId = entry.id && entry.id.$t ? entry.id.$t : Math.random().toString();
            const idMatch = rawId.match(/\.post-(\d+)/);
            const id = idMatch ? idMatch[1] : rawId;

            return {
                id,
                title,
                content: rawContent,
                thumbnail,
                publishedDate,
                publishedDateISO: publishedISO
            };
        });

        blogs.sort((a, b) => new Date(b.publishedDateISO).getTime() - new Date(a.publishedDateISO).getTime());

        fs.writeFileSync('blogs-data.js', 'window.PRELOADED_BLOGS = ' + JSON.stringify(blogs) + ';');
        console.log('Saved blogs-data.js with ' + blogs.length + ' articles');
    } catch (err) {
        console.error('Error fetching blogs:', err);
    }
}

main();
