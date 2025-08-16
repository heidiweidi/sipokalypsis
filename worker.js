/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
  async fetch(request, env, ctx) {
    const references = [
      "John 3:16",
      "Jeremiah 29:11",
      "Philippians 4:13",
      "Proverbs 3:5",
      "Romans 8:28",
      "Psalm 23:1",
      "Isaiah 41:10",
      "Joshua 1:9",
      "Psalm 46:1",
      "1 Corinthians 13:4",
      "Ephesians 2:10",
      "Ephesians 5:8"
    ];

    const randomRef = references[Math.floor(Math.random() * references.length)];
    const apiUrl = `https://bible-api.com/${encodeURIComponent(randomRef)}`;

    try {
      const apiResponse = await fetch(apiUrl);
      const data = await apiResponse.json();

      if (!data || !data.text) {
        return new Response("Verse not found.", { status: 404 });
      }

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Landed by HTML5 UP</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <link rel="stylesheet" href="assets/css/main.css" />
          <noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
        </head>
        <body class="is-preload landing">
          <div id="page-wrapper">
            <!-- Header -->
            <header id="header">
              <h1 id="logo"><a href="index.html">Landed</a></h1>
            </header>

            <!-- Banner -->
            <section id="banner">
              <div class="content">
                <header>
                  <h2>${data.text.trim().replace(/\n/g, "<br>")}</h2>
                  <p>${data.reference}</p>
                </header>
                <span class="image"><img src="images/pic01.jpg" alt="" /></span>
              </div>
              <a href="#one" class="goto-next scrolly">Next</a>
            </section>

            <!-- Footer -->
            <footer id="footer">
              <ul class="icons">
                <li><a href="#" class="icon brands alt fa-twitter"><span class="label">Twitter</span></a></li>
                <li><a href="#" class="icon brands alt fa-facebook-f"><span class="label">Facebook</span></a></li>
                <li><a href="#" class="icon brands alt fa-linkedin-in"><span class="label">LinkedIn</span></a></li>
                <li><a href="#" class="icon brands alt fa-instagram"><span class="label">Instagram</span></a></li>
                <li><a href="#" class="icon brands alt fa-github"><span class="label">GitHub</span></a></li>
                <li><a href="#" class="icon solid alt fa-envelope"><span class="label">Email</span></a></li>
              </ul>
              <ul class="copyright">
                <li>&copy; Untitled. All rights reserved.</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
              </ul>
            </footer>
          </div>

          <!-- Scripts -->
          <script src="assets/js/jquery.min.js"></script>
          <script src="assets/js/jquery.scrolly.min.js"></script>
          <script src="assets/js/jquery.dropotron.min.js"></script>
          <script src="assets/js/jquery.scrollex.min.js"></script>
          <script src="assets/js/browser.min.js"></script>
          <script src="assets/js/breakpoints.min.js"></script>
          <script src="assets/js/util.js"></script>
          <script src="assets/js/main.js"></script>
        </body>
        </html>
      `;

      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8"
        }
      });

    } catch (err) {
      return new Response("Error fetching verse.", { status: 500 });
    }
  },
};
