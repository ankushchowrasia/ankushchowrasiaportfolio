// Vercel Serverless Function: /api/blogs.js
// Securely fetches blogs from Blogger API v3

// Seed data for UI validation (before Blogger sync is live)
const seedBlogs = [
    {
        id: 'seed-1',
        title: 'Lesser-Known Facts About Indian Laws',
        content: `1) You can be arrested without committing a crime. Indian law allows preventive detention, where a person can be detained to prevent a possible future offence, even without committing a crime yet.

2) A witness can be punished for lying, even if the accused is guilty. Giving false testimony is a crime. Perjury can lead to punishment, regardless of whether the final judgment is correct.

3) Courts can order DNA tests—even without consent. In certain cases, courts can direct DNA testing if it is necessary to determine truth and serve justice.

4) Silence in some cases can be treated as evidence. While you have the right to silence, courts may draw limited adverse inferences if silence contradicts proven facts.

5) A wife can file cases at her parental home. In matrimonial offences, complaints can legally be filed where the wife resides, not only where the incident occurred.

6) Judges can summon anyone—even without police request. Courts have the power to summon any person as an accused if evidence appears during trial, even if police did not charge them.

7) Legal notices are not always mandatory. Many civil disputes do not legally require a legal notice; it is often a strategic, not compulsory, step.

8) An accused can defend themselves. Indian law allows an accused person to argue their own case without a lawyer, though it is not advisable.

9) Courts can punish for contempt without a full trial. Contempt of court can be punished swiftly to protect judicial authority, sometimes without lengthy trial procedures.

10) Judges can rely on common sense, not just law books. Courts are allowed to apply judicial notice, accepting certain facts as universally known without formal proof.`,
        thumbnail: 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-03%20124122.png',
        publishedDate: 'January 3, 2026',
        publishedDateISO: '2026-01-03',
        slug: 'lesser-known-facts-about-indian-laws'
    },
    {
        id: 'seed-2',
        title: 'Why Judicial Independence Is the Backbone of Democracy?',
        content: `In my opinion judicial independence is a fundamental pillar of democracy. It ensures that courts function without external pressure from authorities, governments, or public opinion. An independent judiciary allows judges to decide cases based solely on law, evidence, and constitutional principles, which is essential for maintaining public trust in the legal system.

In a democratic country like India, power is divided among the legislature, executive, and judiciary. Judicial independence maintains this balance by acting as a check on the other two branches. When courts are free from influence of the external factors, they can review laws, executive actions, and administrative decisions without fear or bias, protecting constitutional authority.

Without judicial independence, the rights of people become weak. Courts play a crucial role in safeguarding fundamental rights, protections of minority, and civil liberties. If judges are influenced by political ideology or authority, justice may favor power over fairness, weakening the protection that democracy promises to every citizen.

Thus, we can say that democracy cannot survive without an independent judiciary. While reforms and technology can improve efficiency, the core value of judicial independence must remain protected. Courts must be guided by law, reason, not political pressure, to ensure justice, equality, stability.`,
        thumbnail: 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-02%20133747.png',
        publishedDate: 'January 2, 2026',
        publishedDateISO: '2026-01-02',
        slug: 'why-judicial-independence-is-the-backbone-of-democracy'
    },
    {
        id: 'seed-3',
        title: 'Can Technology Replace Human Judges?',
        content: `In my opinion, technology cannot replace human judges in courts; it can only assist judges in providing judgments because law is not just a subject of rules and data but also of justice, equality, and fairness. Decisions require human morality, honesty, and qualities beyond what AI can provide. Judgments cannot be decided solely on past data, as law deals with human lives and values.

In the contemporary world, AI has already begun speeding up tasks such as legal research, managing case files, scheduling hearings and meetings, analyzing large documents, also works as a data analyst. Keeping in note that all of these are the supporting role which an AI provides to the judge, to make their work easier and improve consistency.

The major problem with giving complete authority to an AI judge is that artificial intelligence is trained on past data, including previous judgments. If those judgments contain biases—such as social, class, or gender bias—it is quite possible that the AI will reproduce the same biased judgments, affecting a person's life.

Let us take a hypothetical situation: if the AI judge gives a wrong judgement, then who will take the accountability for that? The programmer? The past decisions? Or the government? I think justice requires accountability, which AI cannot provide for now.

Thus, we can say that AI cannot completely replace human judges, but they can just speed up their work and reduce workload.`,
        thumbnail: 'https://raw.githubusercontent.com/ankushchowrasia/blogs-/e870d84bed6e7e16c9f7d933c186a68f6d2b30b1/Screenshot%202026-01-01%20204357.png',
        publishedDate: 'January 1, 2026',
        publishedDateISO: '2026-01-01',
        slug: 'can-technology-replace-human-judges'
    }
];

// Format date helper
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Extract thumbnail from Blogger post content
function extractThumbnail(content) {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : '/placeholder-blog.jpg';
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    try {
        const apiKey = process.env.BLOGGER_API_KEY;
        const blogId = process.env.BLOGGER_BLOG_ID;

        // If API credentials are not set, return seed data
        if (!apiKey || !blogId) {
            console.log('Blogger API credentials not configured. Using seed data.');
            return res.status(200).json({
                blogs: seedBlogs,
                source: 'seed'
            });
        }

        // Fetch from Blogger API v3
        const response = await fetch(
            `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=100&orderBy=published`
        );

        if (!response.ok) {
            console.error('Blogger API error:', response.status);
            // Fallback to seed data on error
            return res.status(200).json({
                blogs: seedBlogs,
                source: 'seed-fallback'
            });
        }

        const data = await response.json();

        // Normalize Blogger posts
        const blogs = (data.items || []).map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            thumbnail: extractThumbnail(post.content),
            publishedDate: formatDate(post.published),
            publishedDateISO: post.published.split('T')[0],
            slug: createSlug(post.title)
        }));

        // Sort by date (newest first)
        blogs.sort((a, b) =>
            new Date(b.publishedDateISO).getTime() - new Date(a.publishedDateISO).getTime()
        );

        return res.status(200).json({
            blogs,
            source: 'blogger'
        });

    } catch (error) {
        console.error('Error fetching blogs:', error);
        // Return seed data on any error
        return res.status(200).json({
            blogs: seedBlogs,
            source: 'seed-error'
        });
    }
};
