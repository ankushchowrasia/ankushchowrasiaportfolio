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
