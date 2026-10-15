// Vercel Serverless Function: /api/blogs.js
// Securely fetches blogs from Blogger public feed or Blogger API v3

// Fallback seed data in case network is completely unavailable
const seedBlogs = [
    {
        id: 'seed-1',
        title: 'Lesser-Known Facts About Indian Laws',
        content: `1. Preventive Detention: Under Article 22 of the Constitution and relevant statutes, a person can be detained to prevent the commission of an offense, subject to strict procedural safeguards.

2. False Testimony as a Crime: Perjury under Section 191/193 of the Indian Penal Code is a punishable offense regardless of whether the false testimony swayed the outcome.

3. Court-Ordered DNA Testing: In matrimonial and paternity matters, courts possess the authority to order DNA tests when essential to determine the truth and serve justice.

4. Adverse Inferences: While the privilege against self-incrimination is protected under Article 20(3), unexplained silence in civil or specific evidence contexts may give rise to limited judicial inferences.

5. Forum for Matrimonial Complaints: Aggrieved parties in matrimonial disputes may file complaints within jurisdictions where they reside post-separation.

6. Judicial Summoning Powers: Under Section 319 of the Code of Criminal Procedure, courts may summon any person appearing to be involved in an offense, even if not charge-sheeted by police.

7. Legal Notices: Many civil disputes do not statutorily mandate a prior notice, though it often serves as essential strategic documentation.

8. Self-Representation: Litigants retain the constitutional right to appear in person and argue their own case without counsel.

9. Contempt Jurisdiction: High Courts and the Supreme Court hold inherent constitutional powers to punish for contempt to protect judicial authority and administrative dignity.

10. Judicial Notice: Courts may take judicial notice of widely acknowledged facts without requiring formal proof under the Indian Evidence Act.`,
        thumbnail: 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-03%20124122.png',
        publishedDate: 'January 3, 2026',
        publishedDateISO: '2026-01-03',
        slug: 'lesser-known-facts-about-indian-laws'
    },
    {
        id: 'seed-2',
        title: 'Understanding Judicial Independence in a Constitutional Democracy',
        content: `Judicial independence is a cornerstone of constitutional democracy. It guarantees that judges can adjudicate disputes free from external pressure, executive interference, legislative influence, or majoritarian sentiment.

In India's constitutional framework, power is separated among the legislature, executive, and judiciary. Judicial independence allows the courts to maintain checks and balances through judicial review, ensuring that legislative enactments and executive actions conform to constitutional boundaries.

Without an independent judiciary, fundamental rights lose their practical safeguard. The courts exist as the ultimate guarantor of civil liberties, ensuring that equal justice applies to all citizens regardless of status or political authority.`,
        thumbnail: 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-02%20133747.png',
        publishedDate: 'January 2, 2026',
        publishedDateISO: '2026-01-02',
        slug: 'understanding-judicial-independence-in-a-constitutional-democracy'
    },
    {
        id: 'seed-3',
        title: 'Can Technology Replace Human Judges?',
        content: `In the contemporary legal environment, automated tools and artificial intelligence are rapidly improving case management, legal research, and document classification. These technologies assist legal professionals by reducing administrative backlogs and organizing evidence.

However, technology cannot replace the core function of human adjudication. Law is not a mathematical deduction; it requires equitable judgment, moral reasoning, empathy, and contextual understanding of human lives.

Furthermore, automated systems reflect the data on which they are trained. Past judicial records inevitably embody societal and procedural biases. Deploying autonomous decision-making in courts risks entrenching historical inequities while eroding constitutional accountability. Technology must remain an assistive research instrument, not a substitute for human judicial conscience.`,
        thumbnail: 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-01%20204357.png',
        publishedDate: 'January 1, 2026',
        publishedDateISO: '2026-01-01',
        slug: 'can-technology-replace-human-judges'
    }
];

// Format date helper (timezone-safe)
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
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Convert unicode mathematical alphanumeric characters to standard ASCII for typography
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
        .replace(/[\u2013\u2014]/g, '-'); // replace en/em dashes with hyphens
}

// Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Extract first image from HTML content
function extractThumbnail(content) {
    if (!content) return 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-03%20124122.png';
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return imgMatch ? imgMatch[1] : 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-03%20124122.png';
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    // Helper for Vercel/Node response
    const sendJson = (statusCode, data) => {
        if (typeof res.status === 'function') {
            return res.status(statusCode).json(data);
        }
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(data));
    };

    const apiKey = process.env.BLOGGER_API_KEY;
    const blogId = process.env.BLOGGER_BLOG_ID;

    // 1. If official API credentials exist, use Blogger API v3
    if (apiKey && blogId) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=100&orderBy=published`
            );
            if (response.ok) {
                const data = await response.json();
                const blogs = (data.items || []).map((post) => ({
                    id: post.id,
                    title: normalizeUnicodeText(post.title),
                    content: post.content || '',
                    thumbnail: extractThumbnail(post.content),
                    publishedDate: formatDate(post.published),
                    publishedDateISO: post.published.split('T')[0],
                    slug: createSlug(post.title)
                }));
                blogs.sort((a, b) => new Date(b.publishedDateISO).getTime() - new Date(a.publishedDateISO).getTime());
                return sendJson(200, { blogs, source: 'blogger-v3' });
            }
        } catch (err) {
            console.error('Blogger v3 fetch error:', err.message);
        }
    }

    // 2. Fetch all published blogs via public JSON feed (no API key required, 56+ articles)
    try {
        const feedUrl = 'https://ankushchowrasia1.blogspot.com/feeds/posts/default?alt=json&max-results=100';
        const feedRes = await fetch(feedUrl);
        if (feedRes.ok) {
            const feedData = await feedRes.json();
            const entries = feedData.feed && feedData.feed.entry ? feedData.feed.entry : [];

            if (entries.length > 0) {
                const blogs = entries.map((entry) => {
                    const rawTitle = entry.title && entry.title.$t ? entry.title.$t : 'Untitled';
                    const title = normalizeUnicodeText(rawTitle);
                    const rawContent = entry.content && entry.content.$t ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
                    const publishedISO = entry.published && entry.published.$t ? entry.published.$t.split('T')[0] : '2026-01-01';
                    const publishedDate = entry.published && entry.published.$t ? formatDate(entry.published.$t) : '2026';

                    let thumbnail = '';
                    if (entry.media$thumbnail && entry.media$thumbnail.url) {
                        thumbnail = entry.media$thumbnail.url.replace(/=s\d+(-c)?$/, '=w800');
                    } else {
                        thumbnail = extractThumbnail(rawContent);
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
                        publishedDateISO: publishedISO,
                        slug: createSlug(title)
                    };
                });

                blogs.sort((a, b) => new Date(b.publishedDateISO).getTime() - new Date(a.publishedDateISO).getTime());

                return sendJson(200, {
                    blogs,
                    source: 'blogger-feed'
                });
            }
        }
    } catch (feedErr) {
        console.error('Blogger feed fetch error:', feedErr.message);
    }

    // 3. Fallback to seed blogs if completely offline
    return sendJson(200, {
        blogs: seedBlogs,
        source: 'seed-fallback'
    });
};
