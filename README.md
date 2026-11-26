# Milos Arsik · Portfolio

A static portfolio and a separately branded Unemployed Code study site. Both run on GitHub Pages from the root of `main`. The portfolio is at the repository site root and Unemployed Code is at `/unemployed-code/`.

## Preview locally

Run `python3 -m http.server 8000` from this directory and open `http://localhost:8000/`.

## Add an editorial or video

Add a post to `assets/articles.js` with a unique slug, category, title, description, reading time, and sections. Use `DSA`, `LeetCode`, or `Interviews` as the category. The editorial URL is `unemployed-code/post.html?slug=your-slug`.

Set the post’s `videoId` to the 11-character ID of the corresponding YouTube video. An empty ID keeps the video placeholder visible. Set `youtubeChannel` near the top of `assets/site.js` to the channel URL to switch the YouTube search links to the channel.
