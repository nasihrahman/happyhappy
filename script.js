/* ============ EDIT THIS PART ============ */
const CONFIG = {
  name: "Hiba",

  gate: { intro: "Before you enter, answer a few questions." },

  // Put audio files (mp3) in assets/audio/. Volumes go from 0 to 1.
  audio: { music: "assets/audio/music.mp3", musicVolume: 0.3, sfxVolume: 0.8 },

  // Typed answers. The blanks shown match the answer's length.
  // Capitals and spaces don't matter, spelling does. {name} = her name.
  // hint (optional) appears after 3 wrong tries. She only gets in with a correct answer.
  quiz: [
    { q: "Which is the sole metropolitan area in Kerala?", answer: "vdvl",
      wrong: "Wrong. Try again.", hint: "" },
    // { q: "Which is the most popular family in Kerala?", answer: "Avinjikkad",
    //   wrong: "Wrong. You should know this.", hint: "" },
    // { q: "Who is the most beautiful woman?", answer: "{name}",
    //   wrong: "Wrong. Think again.", hint: "" }
  ],

  hero: { title: "Happy Birthday, {name}" },

  // Put images in assets/photos/. note = hidden message shown when she taps the photo.
  photos: [
    { src: "assets/photos/7.jpeg", note: "the smartest" },
    { src: "assets/photos/2.png", note: "the prettiest" },
    { src: "assets/photos/3.png", note: "the funniest" },
    { src: "assets/photos/4.png", note: "my fav" },
    { src: "assets/photos/1.png", note: "ilysm" },
    
    { video: "assets/videos/1.mp4", poster: "assets/photos/video-poster.jpg", note: "my fav dancer" }
  ],

  letter: {
    paragraphs: [
      "My Dearest Hiba,",
      "Happiest Birthday to the girl i love the most",
      // "My best day was the day when u told me ily",
      "My best moments were the those i spent with u",
      "we mightve had kunji fights but we r perfect", 
      "i love you more than anything"
    ],
    signoff: "Nasih",
    photo: "assets/photos/letter.jpg"   // set to "" for no final photo
  },

  game: {
    seconds: 30,
    herFace: "assets/her.png",
    startTitle: "You found me.",
    startText: "Every card is someone. Tap them, and go for me. You have 30 seconds.",

    // Every card is always filled and keeps changing. A tapped card changes right away.
    //  points = score per tap | weight = how often it shows up (relative to the others)
    //  hitImg = image shown when tapped (optional, "" to skip)
    //  sfx    = sound played when tapped (optional, "" for none)
    //  lines  = said on that target's 1st, 5th, 10th... tap (its own tap count)
    //  win    = shown at the end if this target got the most hits
    targets: [
      { id: "him", label: "Boyfriend", img: "assets/him.png", hitImg: "assets/him-hit.png", sfx: "assets/audio/him.mp3", points: 1, weight: 4,
        // lines: { 1: "HEY! What did I do?", 5: "Babe, we can talk about this.", 10: "I'm sorry for everything.", 20: "Okay, okay, you win." },
        win: "You've successfully humbled me. Happy Birthday, troublemaker." },
      { id: "jungkook", label: "Jungkook", img: "assets/jungkook.png", hitImg: "", sfx: "assets/audio/jungkook.mp3", points: 1, weight: 3,
        // lines: { 1: "Jungkook! Good taste.", 5: "Jungkook again?" },
        win: "Jungkook got more hits than me. Fair." },
      { id: "buldak", label: "Buldak", img: "assets/buldak.png", hitImg: "", sfx: "assets/audio/buldak.mp3", points: 1, weight: 3,
        // lines: { 1: "Buldak! Spicy.", 5: "More Buldak?" },
        win: "Buldak beat me. I know my place." }
    ],
    none: "No hits at all. Try again?"
  }
};
/* ============ END OF EDIT PART ============ */

const $ = id => document.getElementById(id);
const t = s => s.replaceAll("{name}", CONFIG.name);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };

// any image that fails to load gets a neutral placeholder look
document.addEventListener("error", e => { if (e.target.tagName === "IMG") e.target.classList.add("missing"); }, true);

/* ---------- Quiz ---------- */
let qi = 0, tries = 0, locked = false;
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
$("gate-intro").textContent = CONFIG.gate.intro;

function drawBoxes() {
  const typed = $("q-input").value.replace(/\s/g, "");
  let k = 0;
  $("q-boxes").replaceChildren(...[...t(CONFIG.quiz[qi].answer)].map(c => {
    if (c === " ") return el("span", "box gap");
    const b = el("span", "box", typed[k] || "");
    if (k === typed.length) b.classList.add("cur");
    k++;
    return b;
  }));
}

function showQuestion() {
  const item = CONFIG.quiz[qi];
  tries = 0; locked = false;
  $("q-text").textContent = t(item.q);
  $("q-feedback").textContent = "";
  $("q-progress").textContent = `${qi + 1} / ${CONFIG.quiz.length}`;
  $("q-input").value = "";
  $("q-input").maxLength = t(item.answer).replace(/\s/g, "").length;
  drawBoxes();
  $("q-input").focus();
}

function check() {
  if (locked) return;
  const item = CONFIG.quiz[qi], guess = norm($("q-input").value);
  if (!guess) return;
  if (guess === norm(t(item.answer))) {
    locked = true;
    setTimeout(() => { qi++; qi < CONFIG.quiz.length ? showQuestion() : enterSite(); }, 350);
    return;
  }
  tries++;
  $("q-feedback").textContent = t(item.wrong) + (tries >= 3 && item.hint ? " Hint: " + item.hint : "");
  $("q-input").value = "";
  drawBoxes();
  $("q-answer").classList.add("bad");
  setTimeout(() => $("q-answer").classList.remove("bad"), 300);
}

$("q-input").oninput = e => { e.target.value = e.target.value.replace(/\s/g, ""); drawBoxes(); };
$("q-input").onkeydown = e => { if (e.key === "Enter") check(); };
$("q-check").onclick = check;

function enterSite() {
  $("gate").classList.add("out");
  setTimeout(() => { $("gate").hidden = true; $("site").hidden = false; window.scrollTo(0, 0); }, 400);
}

/* ---------- Main page ---------- */
$("hero-title").textContent = t(CONFIG.hero.title);
$("hero-sub").textContent = CONFIG.hero.sub;

// plays the gallery videos only while they're on screen (saves battery, autoplay is more reliable)
const io = new IntersectionObserver(entries => entries.forEach(e => {
  e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause();
}), { threshold: 0.4 });

CONFIG.photos.forEach(p => {
  const b = el("button", "polaroid");
  let media;
  if (p.video) {
    media = el("video");
    media.src = p.video;
    if (p.poster) media.poster = p.poster;
    media.muted = true; media.loop = true; media.autoplay = true; media.playsInline = true;
    media.setAttribute("muted", "");        // iOS needs the attribute, not only the property
    media.preload = "metadata";
    io.observe(media);
  } else {
    media = el("img"); media.src = p.src; media.alt = "Photo"; media.loading = "lazy";
  }
  b.append(media);
  b.onclick = () => {
    const isVid = !!p.video;
    $("lb-img").hidden = isVid;
    $("lb-video").hidden = !isVid;
    if (isVid) { $("lb-video").src = p.video; $("lb-video").play().catch(() => {}); }
    else $("lb-img").src = p.src;
    $("lb-note").textContent = p.note || "";
    $("lb").showModal();
  };
  $("gallery").append(b);
});
$("lb-close").onclick = () => $("lb").close();
$("lb").onclick = e => { if (e.target === $("lb")) $("lb").close(); };
$("lb").onclose = () => { const v = $("lb-video"); v.pause(); v.removeAttribute("src"); v.load(); };

/* ---------- Letter ---------- */
const L = CONFIG.letter;
L.paragraphs.forEach(p => $("letter").append(el("p", "", t(p))));
$("letter").append(el("p", "sign", L.signoff));
if (L.photo) { const i = el("img"); i.src = L.photo; i.alt = ""; $("letter").append(i); }
$("open-letter").onclick = () => {
  $("open-letter").hidden = true;
  $("letter").hidden = false;
  $("letter").scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ---------- Game ---------- */
const G = CONFIG.game;
let score = 0, counts = {}, running = false, gid = 0, startAt = 0, timer, sayTimer, nextT;
const totalWeight = G.targets.reduce((s, x) => s + x.weight, 0);
const pickTarget = () => { let r = Math.random() * totalWeight; return G.targets.find(x => (r -= x.weight) < 0) || G.targets[0]; };

/* ---------- Audio ---------- */
const A = CONFIG.audio;
const music = new Audio(A.music); music.loop = true; music.volume = A.musicVolume;
let musicOn = true, sfxOn = true;
const playMusic = () => music.play().catch(() => {});
// browsers only allow sound after a tap, so music starts on her first tap anywhere
document.addEventListener("pointerdown", () => { if (musicOn) playMusic(); }, { once: true });
G.targets.forEach(x => { if (x.sfx) { x._a = new Audio(x.sfx); x._a.preload = "auto"; } });
function playSfx(tg) {
  if (!sfxOn || !tg._a) return;
  const a = tg._a.cloneNode(); a.volume = A.sfxVolume;
  a.play().catch(() => {});
}
$("t-music").onclick = () => {
  musicOn = !musicOn;
  $("t-music").textContent = "Music: " + (musicOn ? "on" : "off");
  musicOn ? playMusic() : music.pause();
};
$("t-sfx").onclick = () => {
  sfxOn = !sfxOn;
  $("t-sfx").textContent = "Sound: " + (sfxOn ? "on" : "off");
};

$("g-her").src = G.herFace;
const holes = Array.from({ length: 9 }, () => {
  const h = el("button", "hole");
  const f = el("img", "face"); f.alt = "";
  h.append(f);
  h.onpointerdown = () => hit(h);
  $("g-grid").append(h);
  return h;
});
const faceOf = h => h.firstChild;

function say(text) {
  $("g-says").textContent = text;
  clearTimeout(sayTimer);
  sayTimer = setTimeout(() => $("g-says").textContent = "", 1800);
}

// fill a card with a random target
function setCard(h) {
  const tg = pickTarget(), f = faceOf(h);
  h._t = tg;
  h.classList.remove("hit", "pop");
  f.onerror = null; f.classList.remove("missing"); f.src = tg.img; f.alt = tg.label;
  void h.offsetWidth;                // restart the pop animation
  h.classList.add("pop");
}

function hit(h) {
  if (!running) return;
  $("g-her").classList.add("hop");
  setTimeout(() => $("g-her").classList.remove("hop"), 120);
  if (h.classList.contains("hit")) return;
  const tg = h._t, f = faceOf(h);
  h.classList.add("hit");
  if (tg.hitImg) {
    f.onerror = () => { f.onerror = null; f.classList.remove("missing"); f.src = tg.img; };
    f.src = tg.hitImg;
  }
  playSfx(tg);
  counts[tg.id]++;
  score += tg.points;
  $("g-score").textContent = score;
  const line = tg.lines && tg.lines[counts[tg.id]];
  if (line) say(line);
  clearTimeout(nextT);               // pause the refresh while the reaction plays
  const id = gid;
  setTimeout(() => { if (running && id === gid) { holes.forEach(setCard); schedule(id); } }, 300);
}

// the whole board refreshes at once, faster over time
function schedule(id) {
  clearTimeout(nextT);
  const every = Math.max(900, 1800 - (performance.now() - startAt) * 0.03);
  nextT = setTimeout(() => {
    if (!running || id !== gid) return;
    holes.forEach(setCard);
    schedule(id);
  }, every);
}

function startGame() {
  score = 0; running = true; gid++;
  counts = Object.fromEntries(G.targets.map(x => [x.id, 0]));
  let left = G.seconds;
  $("g-score").textContent = 0; $("g-time").textContent = left; $("g-says").textContent = "";
  $("g-modal").hidden = true;
  holes.forEach(setCard);
  startAt = performance.now();
  schedule(gid);
  timer = setInterval(() => {
    $("g-time").textContent = --left;
    if (left <= 0) endGame();
  }, 1000);
}

function endGame() {
  running = false; clearInterval(timer); clearTimeout(nextT);
  holes.forEach(h => h.classList.remove("hit"));
  const max = Math.max(...G.targets.map(x => counts[x.id]));
  const winners = G.targets.filter(x => counts[x.id] === max);
  $("g-title").textContent = max ? "Most hits: " + winners.map(x => x.label).join(" & ") : "No hits";
  $("g-text").textContent = max ? `Score: ${score}. ${winners[0].win || ""}` : G.none;
  $("g-break").textContent = G.targets.map(x => `${x.label}: ${counts[x.id]}`).join("  ·  ");
  $("g-go").textContent = "Play again";
  $("g-letter").hidden = false;
  $("g-modal").hidden = false;
}

function closeGame() {
  running = false; clearInterval(timer); clearTimeout(nextT);
  $("game").hidden = true;
  document.body.style.overflow = "";
}

$("lurker").onclick = () => {
  $("g-title").textContent = G.startTitle;
  $("g-text").textContent = G.startText;
  $("g-break").textContent = "";
  $("g-go").textContent = "Start";
  $("g-letter").hidden = true;
  $("g-modal").hidden = false;
  $("game").hidden = false;
  document.body.style.overflow = "hidden";
};
$("g-go").onclick = startGame;
$("g-close").onclick = closeGame;
$("g-letter").onclick = () => { closeGame(); $("letter-section").scrollIntoView({ behavior: "smooth" }); };

showQuestion();