document.addEventListener("DOMContentLoaded", async () => {
  // 1. Parse name from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name") || "Friend";

  // 2. Greeting templates
  const greetings = [
    `Hello ${name}, may your heart be lifted today by God's Word.`,
    `${name}, here’s an encouraging scripture chosen for you.`,
    `Peace and blessings to you, ${name}. Receive strength from this verse.`,
    `Dear ${name}, may this passage inspire and comfort you today.`,
    `Greetings ${name}! Here’s a verse that speaks to hope and faith.`,
  ];
  const greetingMsg = greetings[Math.floor(Math.random() * greetings.length)];

  // Place greeting in page (expects an element with id="greeting")
  const greetingElem = document.getElementById("greeting");
  if (greetingElem) greetingElem.textContent = greetingMsg;

  // 3. Bible references
  const references = [
    "John 3:16",
    "Philippians 4:13",
    "Proverbs 3:5",
    "Romans 8:28",
    "Psalm 23:1",
    "Isaiah 41:10",
    "Joshua 1:9",
    "Psalm 46:1",
    "1 Corinthians 13:4",
    "Ephesians 2:10",
    "Ephesians 5:8",
    "Isaiah 26:3",
    "Psalm 119:105",
    "Romans 12:2",
    "2 Timothy 1:7",
    "Philippians 4:6-7",
    "Matthew 11:28-30",
    "Psalm 37:4",
    "Jeremiah 29:11",
    "1 Peter 5:7",
    "Hebrews 13:5-6",
    "Psalm 91:1-2",
    "Romans 15:13",
    "Psalm 34:18",
    "James 1:5",
    "Colossians 3:23-24",
    "Galatians 5:22-23",
    "Psalm 118:24",
    "Matthew 5:16",
    "Psalm 139:14",
    "1 John 4:19",
    "Romans 5:8",
    "Psalm 100:4-5",
    "2 Corinthians 5:17",
    "Philippians 1:6",
    "Psalm 121:1-2",
    "Proverbs 16:3",
    "Isaiah 40:31",
    "Matthew 6:33-34",
    "Psalm 30:5",
    "Romans 10:9-10",
    "1 Thessalonians 5:16-18",
    "Psalm 119:11",
    "2 Corinthians 12:9",
    "Psalm 73:26",
    "John 14:27",
    "Proverbs 18:10",
    "Psalm 19:14",
    "1 Chronicles 16:11",
    "Psalm 55:22",
    "Isaiah 43:2",
    "Psalm 62:5-6",
    "Romans 8:31",
    "1 Corinthians 10:13",
    "Psalm 119:114", 
    "Psalm 16:11",
    "Psalm 37:5",
    "Psalm 119:165",
    "Psalm 40:1-3",
    "Psalm 91:11-12",
    "Psalm 145:18-19",
    "Romans 8:38-39",
    "2 Corinthians 4:16-18",
    "Philippians 3:13-14",
    "Colossians 1:9-10",
    "Ecclesiastes 3:11",
    "Psalm 140:6-7",
    "Psalm 141:1-4",
  ];

  const randomRef = references[Math.floor(Math.random() * references.length)];
  const apiUrl = `https://bible-api.com/${encodeURIComponent(randomRef)}`;

  try {
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    if (data && data.text) {
      const verseElem = document.getElementById("verse");
      const refElem = document.getElementById("reference");
      if (verseElem) verseElem.innerHTML = data.text.trim().replace(/\n/g, "<br>");
      if (refElem) refElem.textContent = data.reference;
    } else {
      if (document.getElementById("verse")) document.getElementById("verse").textContent = "Verse not found.";
      if (document.getElementById("reference")) document.getElementById("reference").textContent = "";
    }
  } catch (err) {
    if (document.getElementById("verse")) document.getElementById("verse").textContent = "Error fetching verse.";
    if (document.getElementById("reference")) document.getElementById("reference").textContent = "";
  }
});