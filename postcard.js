/* ===== Postcards: two video clips, fully separate from the rest of the site =====
   To remove them, comment out or delete the POSTCARDS block in index.html.
   Nothing else needs to change. ============================================== */

const POSTCARDS_TITLE = "Two postcards";

// Put videos (mp4) in assets/video/. poster = optional still image shown before play.
const POSTCARDS = [
  { video: "assets/video/postcard1.mp4", poster: "assets/video/postcard1.jpg", stamp: "Oct 20", message: "EDIT message", from: "Nasih" },
  { video: "assets/video/postcard2.mp4", poster: "assets/video/postcard2.jpg", stamp: "Oct 20", message: "EDIT message", from: "Nasih" }
];

(function () {
  const box = document.getElementById("postcards");
  if (!box) return;

  const title = document.createElement("h2");
  title.textContent = POSTCARDS_TITLE;
  box.append(title);

  const vids = [];
  POSTCARDS.forEach(p => {
    const card = document.createElement("article");
    card.className = "postcard";
    card.innerHTML =
      '<div class="pc-media"><video controls playsinline preload="metadata"></video><span class="pc-stamp"></span></div>' +
      '<p class="pc-msg"></p><p class="pc-from"></p>';
    const v = card.querySelector("video");
    v.src = p.video + "#t=0.1";                       // shows a first frame on phones
    if (p.poster) v.poster = p.poster;
    card.querySelector(".pc-stamp").textContent = p.stamp || "";
    card.querySelector(".pc-msg").textContent = p.message || "";
    card.querySelector(".pc-from").textContent = p.from || "";
    box.append(card);
    vids.push(v);

    // only one video at a time, and pause the background music while a video plays
    v.addEventListener("play", () => {
      vids.forEach(o => { if (o !== v) o.pause(); });
      if (typeof music !== "undefined") music.pause();
    });
    v.addEventListener("pause", () => {
      if (vids.some(o => !o.paused)) return;
      if (typeof music !== "undefined" && typeof musicOn !== "undefined" && musicOn) music.play().catch(() => {});
    });
  });
})();