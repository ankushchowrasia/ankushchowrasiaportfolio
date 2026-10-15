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
                    // Bold uppercase (A-Z)
                    if (code >= 0x1D400 && code <= 0x1D419) return String.fromCharCode(code - 0x1D400 + 65);
                    // Bold lowercase (a-z)
                    if (code >= 0x1D41A && code <= 0x1D433) return String.fromCharCode(code - 0x1D41A + 97);
                    // Italic uppercase (A-Z)
                    if (code >= 0x1D434 && code <= 0x1D44D) return String.fromCharCode(code - 0x1D434 + 65);
                    // Italic lowercase (a-z)
                    if (code >= 0x1D44E && code <= 0x1D467) return String.fromCharCode(code - 0x1D44E + 97);
                    // Bold Italic uppercase (A-Z)
                    if (code >= 0x1D468 && code <= 0x1D481) return String.fromCharCode(code - 0x1D468 + 65);
                    // Bold Italic lowercase (a-z)
                    if (code >= 0x1D482 && code <= 0x1D49B) return String.fromCharCode(code - 0x1D482 + 97);
                    // Sans-serif Bold uppercase (A-Z)
                    if (code >= 0x1D5D4 && code <= 0x1D5ED) return String.fromCharCode(code - 0x1D5D4 + 65);
                    // Sans-serif Bold lowercase (a-z)
                    if (code >= 0x1D5EE && code <= 0x1D607) return String.fromCharCode(code - 0x1D5EE + 97);
                    // Digits
                    if (code >= 0x1D7CE && code <= 0x1D7D7) return String.fromCharCode(code - 0x1D7CE + 48);
                    if (code >= 0x1D7D8 && code <= 0x1D7E1) return String.fromCharCode(code - 0x1D7D8 + 48);
                    if (code >= 0x1D7E2 && code <= 0x1D7EB) return String.fromCharCode(code - 0x1D7E2 + 48);
                    if (code >= 0x1D7EC && code <= 0x1D7F5) return String.fromCharCode(code - 0x1D7EC + 48);
                    if (code >= 0x1D7F6 && code <= 0x1D7FF) return String.fromCharCode(code - 0x1D7F6 + 48);
                    return char;
                })
                .replace(/[\u2013\u2014]/g, '-');
        }

        function formatDate(dateStr) {
            if (!dateStr) return '';
            const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (isoMatch) {
                const year = parseInt(isoMatch[1], 10);
                const monthIndex = parseInt(isoMatch[2], 10) - 1;
                const day = parseInt(isoMatch[3], 10);
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return `${monthNames[monthIndex]} ${day}, ${year}`;
            }
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
