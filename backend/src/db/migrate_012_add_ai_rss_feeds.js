const db = require('./index');

const rssFeeds = [
  { name: 'OpenAI News', type: 'rss', url: 'https://openai.com/news/rss.xml' },
  { name: 'Google DeepMind', type: 'rss', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Meta AI Blog', type: 'rss', url: 'https://ai.meta.com/blog/rss/' },
  { name: 'NVIDIA Blog - AI', type: 'rss', url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/' },
  { name: 'Hugging Face Blog', type: 'rss', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'MIT Tech Review - AI', type: 'rss', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/' },
  { name: 'Microsoft Research AI', type: 'rss', url: 'https://www.microsoft.com/en-us/research/blog/category/artificial-intelligence/feed/' },
  { name: 'AWS ML Blog', type: 'rss', url: 'https://aws.amazon.com/blogs/machine-learning/feed/' },
  { name: 'Stability AI News', type: 'rss', url: 'https://stability.ai/news?format=rss' },
  { name: 'LangChain Blog', type: 'rss', url: 'https://blog.langchain.dev/rss/' },
  { name: 'BAIR Blog', type: 'rss', url: 'https://bair.berkeley.edu/blog/feed.xml' },
  { name: 'SAIL Blog', type: 'rss', url: 'https://ai.stanford.edu/blog/feed.xml' },
  { name: 'Naver Search & AI', type: 'rss', url: 'https://rss.blog.naver.com/naver_search.xml' },
  { name: 'Kakao Enterprise Tech', type: 'rss', url: 'https://tech.kakaoenterprise.com/rss' },
  { name: 'SK Telecom Newsroom', type: 'rss', url: 'https://news.sktelecom.com/feed' },
  { name: 'LY Corporation Tech Blog (KO)', type: 'rss', url: 'https://techblog.lycorp.co.jp/ko/feed/index.xml' },
  { name: 'NCSOFT DANBI Blog', type: 'rss', url: 'https://danbi-ncsoft.github.io/feed.xml' },
  { name: 'Kakao Tech Blog', type: 'rss', url: 'https://tech.kakao.com/feed' },
  { name: 'Toss Tech Blog', type: 'rss', url: 'https://toss.tech/rss.xml' }
];

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO sources (name, type, url, reliability_score) SELECT ?, ?, ?, 1.0 WHERE NOT EXISTS (SELECT 1 FROM sources WHERE url = ?)");
  
  let completed = 0;
  
  rssFeeds.forEach(feed => {
    stmt.run(feed.name, feed.type, feed.url, feed.url, function(err) {
        if (err) {
            console.error(`Error adding ${feed.name}:`, err.message);
        } else if (this.changes > 0) {
            console.log(`Added ${feed.name}`);
        } else {
            console.log(`Skipped ${feed.name} (already exists)`);
        }
        
        completed++;
        if (completed === rssFeeds.length) {
            stmt.finalize();
            // Don't close db here if it's shared, but migrate scripts often do.
            // In this project, migrate scripts seem to handle closure if run standalone.
        }
    });
  });
});
