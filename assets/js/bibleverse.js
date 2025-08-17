document.addEventListener("DOMContentLoaded", async () => {
 
  const apiUrl = `https://bible-api.com/data/web/random/1JN,2JN,3JN,ECC,MAT,MRK,LUK,JOH,1COR,2COR,GAL,EPH,1TH,2TH`;

  try {
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    console.log(data.random_verse)

    if (apiResponse.ok && data.random_verse) {
      const verseElem = document.getElementById("verse");
      const refElem = document.getElementById("reference");
      if (verseElem) verseElem.innerHTML = data.random_verse.text.trim().replace(/\n/g, "<br>");
      if (refElem) refElem.textContent = data.random_verse.book + " " + data.random_verse.chapter + ":" + data.random_verse.verse;
    } else {
      if (document.getElementById("verse")) document.getElementById("verse").textContent = "Verse not found.";
      if (document.getElementById("reference")) document.getElementById("reference").textContent = "";
    }
  } catch (err) {
    if (document.getElementById("verse")) document.getElementById("verse").textContent = "Error fetching verse.";
    if (document.getElementById("reference")) document.getElementById("reference").textContent = "";
  }
});