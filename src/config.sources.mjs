// SOURCES — single source of truth for the content aggregator.
// Plain JS so BOTH the Node orchestrator (scripts/) and Astro (via config.ts) can import it.
// SECURITY: this repo is public. Never put secrets here — only public handles.
export const SOURCES = {
  github: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxCommits: 50,
    maxPages: 3,
  },
  codeforces: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxRatings: 50,
  },
  pypi: {
    enabled: true,
    handle: "sqloutbox",
    maxPackages: 25,
  },
  npm: {
    enabled: false,
    packages: [],
    maxPackages: 25,
  },
  rss: {
    enabled: true,
    feeds: ["https://medium.com/feed/@sandeepyadav1478"],
    maxPosts: 50,
  },
  youtube: {
    enabled: false,
    handle: "",
    maxVideos: 15,
  },
  stackoverflow: {
    enabled: false,
    handle: "",
    maxPosts: 25,
  },
  bluesky: {
    enabled: false,
    handle: "",
    maxPosts: 25,
  },
  mastodon: {
    enabled: false,
    instance: "",
    user: "",
    maxPosts: 25,
  },
  credly: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxBadges: 50,
    includeExpired: true,
  },
  huggingface: {
    enabled: true,
    handle: "sandeepyadav1478",
    maxBadges: 50,
  },
  wakatime: {
    enabled: true,
    handle: "sandeepyadav1478",
    profileUrl: "https://wakatime.com/@sandeepyadav1478",
    range: "last_7_days",
  },
  leetcode: {
    enabled: true,
    handle: "sandeepyadav1478",
  },
  linkedin: {
    enabled: true,
    cacheFile: "src/data/linkedin-cache.json",
  },
};
