# Milos Arsik · Portfolio

A static portfolio and a separately branded Unemployed Code study site. Both run on GitHub Pages from the root of `main`. The portfolio is at the repository site root and Unemployed Code is at `/unemployed-code/`.

## Preview locally

Run `python3 -m http.server 8000` from this directory and open `http://localhost:8000/`.

## Add a lesson or video

Add a lesson to `assets/articles.js` with a unique slug, category, title, description, reading time, and sections. Use `DSA`, `LeetCode`, or `Interviews` as the category. Add the slug to the corresponding course module in `assets/site.js` to place the lesson in the sidebar and course sequence.

A course URL looks like `unemployed-code/course.html?course=dsa`; a lesson URL adds `&lesson=arrays`.

Set the lesson’s `videoId` to the 11-character ID of the corresponding YouTube video. An empty ID keeps the video placeholder visible. The YouTube buttons link to the Unemployed Code channel.
