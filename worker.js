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
          <meta charset="UTF-8" />
          <title>Word of Life</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background: #222222;
              color: #333;
              text-align: center;
              padding: 50px;
              margin: auto 0;
            }
            .verse-box {
              background: #fff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            #verse-text {
              font-size: 1.5em;
              margin-bottom: 20px;
            }
            #verse-ref {
              font-size: 1em;
              font-weight: bold;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="verse-box">
            <div id="verse-text">${data.text.trim().replace(/\n/g, "<br>")}</div>
            <div id="verse-ref">${data.reference}</div>
          </div>
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
