LEVELUP — static site

Deploy: drag this whole folder into Netlify Drop (or push to GitHub Pages /
Cloudflare Pages). No build step, no config. Publish directory = folder root.

Structure
  index.html                  the site
  js/support.js               runtime (loads React from unpkg CDN)
  js/LevelUpPrototype.jsx     the in-page phone prototype
  assets/images/              all photos, kit renders, store badges, logos
  assets/fonts/               self-hosted woff2 + fonts.css

All internal paths are relative. The only external requests are the Google
Fonts stylesheet, the unpkg React/Babel CDN, and the YouTube embed in the
Pitch section. Nothing references Claude.

Note: open it through a server, not by double-clicking index.html — browsers
block local file:// fetches. Locally: python3 -m http.server, then
http://localhost:8000
