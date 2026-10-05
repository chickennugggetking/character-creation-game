const avatarState = {
  hair: "brown",
  skin: "peach",
  top: "pink",
  bottom: "blue",
  accessory: "none"
};

const roomNames = {
  home: "Home",
  park: "Park",
  cafe: "Cafe",
  shop: "Style Shop"
};

const items = {
  hair: [
    { name: "Brown Bob", value: "brown", color: "#2b1d29" },
    { name: "Blonde Waves", value: "blonde", color: "#d7b95d" },
    { name: "Pink Dream", value: "pink", color: "#ff7dbb" },
    { name: "Black Star", value: "black", color: "#1a1a1a" }
  ],
  skin: [
    { name: "Peach", value: "peach", color: "#f7d8bf" },
    { name: "Honey", value: "honey", color: "#d9a06d" },
    { name: "Chocolate", value: "choco", color: "#8d5a40" },
    { name: "Fair", value: "fair", color: "#f6ebdf" }
  ],
  top: [
    { name: "Pink Tee", value: "pink", color: "#ffb7d8" },
    { name: "Purple Hoodie", value: "purple", color: "#ab9cff" },
    { name: "Mint Dress", value: "mint", color: "#9ef0c1" },
    { name: "Yellow Sweater", value: "yellow", color: "#ffe08d" }
  ],
  bottom: [
    { name: "Blue Skirt", value: "blue", color: "#86d0ff" },
    { name: "Jeans", value: "jean", color: "#5ca7ff" },
    { name: "Pink Shorts", value: "shorts", color: "#ff95c8" },
    { name: "Orange Pants", value: "orange", color: "#f7b26a" }
  ],
  accessory: [
    { name: "None", value: "none", color: "#ffffff" },
    { name: "Star Clip", value: "star", color: "#ffd76a" },
    { name: "Bow", value: "bow", color: "#ff9ad0" },
    { name: "Heart Glasses", value: "glasses", color: "#8bd4ff" }
  ]
};

const inventory = [
  "Pink Tee",
  "Blue Skirt",
  "Star Clip",
  "Blonde Waves",
  "Mint Dress"
];

const coinsEl = document.getElementById("coins");
const moodEl = document.getElementById("mood");
const inventoryEl = document.getElementById("inventory");
const miniGameArea = document.getElementById("mini-game-area");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const avatarEl = document.getElementById("avatar");

let coins = 120;
let score = 0;
let timer = 20;
let timerId = null;
let miniGameActive = false;
let currentRoom = "home";
let avatarX = 210;
let avatarY = 190;

const PERSONALITY = {
  bubbly: {
    greetings: [
      "Hiya! I was hoping you'd come talk to me!",
      "Hey! You always make my day better!",
      "Hi hi! I have so much to tell you!",
      "Oh! You came over just in time!"
    ],
    compliments: [
      "Aww, thank you! I love this look on me!",
      "You really know style!",
      "That makes me smile so much!",
      "This outfit is adorable, and so are you for noticing!"
    ],
    questions: [
      "What should we do next?",
      "Do you want to hang out somewhere cute?",
      "What kind of outfit should I wear next?",
      "Want to explore the town with me?"
    ],
    neutral: [
      "Tell me more!",
      "That sounds fun!",
      "I like that idea.",
      "Hehe, I’m listening!",
      "Ooh, I never thought of that.",
      "That’s cute."
    ],
    mood: {
      happy: "I’m feeling extra happy today!",
      sleepy: "I could use a little nap...",
      hungry: "I’m kind of hungry now...",
      bored: "I’m a little bored... want to do something fun?",
      silly: "I’m feeling extra goofy today!"
    }
  },
  shy: {
    greetings: [
      "H-hi... I’m glad you came over.",
      "Oh! Hello...",
      "I was hoping you’d say hi.",
      "H-hi there..."
    ],
    compliments: [
      "T-thank you... I really tried hard today.",
      "Aww... that makes me blush.",
      "You’re too sweet...",
      "I’m glad you noticed."
    ],
    questions: [
      "Do you want to sit with me for a bit?",
      "Would you want to walk around together?",
      "What do you think I should do next?",
      "Do you think this outfit is cute?"
    ],
    neutral: [
      "That’s nice...",
      "I’m thinking about it...",
      "Hehe... okay.",
      "I like that.",
      "That sounds nice.",
      "I’m a little flustered, but I like it."
    ],
    mood: {
      happy: "I’m feeling a little shy, but happy!",
      sleepy: "I’m a bit tired...",
      hungry: "I could use a snack...",
      bored: "I don’t really know what to do...",
      silly: "I’m trying not to giggle..."
    }
  },
  dramatic: {
    greetings: [
      "Ah, the star of the day has arrived!",
      "At last, my audience has returned!",
      "The moment is dramatic and perfect.",
      "Welcome, my favorite person."
    ],
    compliments: [
      "A stunning choice! Truly magnificent.",
      "You have excellent taste, darling.",
      "This is a masterpiece, and so is your eye.",
      "Perfectly dramatic and perfectly you."
    ],
    questions: [
      "What grand adventure shall we begin today?",
      "Would you like to witness my newest idea?",
      "Should we make today dramatic?",
      "Tell me, what is your favorite scene?"
    ],
    neutral: [
      "How fascinating.",
      "A brilliant thought indeed.",
      "I admire that idea.",
      "This is quite the moment.",
      "Very stylish.",
      "You always keep things interesting."
    ],
    mood: {
      happy: "Everything feels a little more dramatic when I’m happy!",
      sleepy: "Even the stars need a break...",
      hungry: "A dramatic hunger is setting in...",
      bored: "I need a little excitement.",
      silly: "I feel wonderfully ridiculous today."
    }
  },
  calm: {
    greetings: [
      "Hello. It’s nice to see you.",
      "Good to see you again.",
      "Hi. I was just thinking about our chat.",
      "Hey. I’m glad you came by."
    ],
    compliments: [
      "That’s a really nice choice.",
      "You have a good eye for style.",
      "I appreciate that.",
      "That makes me feel warm and happy."
    ],
    questions: [
      "What would you like to do today?",
      "Do you want to relax together?",
      "Should we take a slow walk?",
      "Is there anything you’d like to talk about?"
    ],
    neutral: [
      "That sounds lovely.",
      "I like that idea.",
      "I’m glad you said that.",
      "That feels peaceful.",
      "A calm thought.",
      "That’s nice to hear."
    ],
    mood: {
      happy: "I feel really peaceful today.",
      sleepy: "I could doze off for a bit.",
      hungry: "A little snack would make me feel better.",
      bored: "I’d enjoy a quiet change of pace.",
      silly: "I feel a little playful, actually."
    }
  }
};

const npcNames = ["Mimi", "Luna", "Sora", "Nia"];
const npcTemplates = [
  { name: "Mimi", personality: "bubbly", mood: "happy", relationship: 72, history: [] },
  { name: "Luna", personality: "shy", mood: "happy", relationship: 64, history: [] },
  { name: "Sora", personality: "dramatic", mood: "happy", relationship: 68, history: [] },
  { name: "Nia", personality: "calm", mood: "happy", relationship: 76, history: [] }
];

const npcs = npcTemplates.map((npc) => ({ ...npc, memory: [], likes: ["cute outfits", "music", "snacks", "games"], dislikes: ["being bored", "rainy days", "too much noise"] }));
let selectedNpcIndex = 0;

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getMoodReply(npc, message) {
  const text = normalizeText(message);
  const personality = PERSONALITY[npc.personality] || PERSONALITY.bubbly;

  if (npc.mood === "hungry") {
    if (/\b(food|eat|snack|cake|pizza|fruit|ramen|juice)\b/.test(text)) {
      return pick([
        "Yes please! I could really go for that.",
        "That sounds amazing right now.",
        "Mmm, that would help so much."
      ]);
    }
    return pick([
      "My tummy is rumbling a little...",
      "I could really use a snack right now.",
      "I’m kind of hungry..."
    ]);
  }

  if (npc.mood === "sleepy") {
    if (/\b(sleep|nap|rest|tired|yawn)\b/.test(text)) {
      return pick([
        "I know... I was starting to drift off.",
        "A nap sounds perfect right now.",
        "I was almost asleep already."
      ]);
    }
    return pick([
      "I’m a little sleepy, but I’m still listening.",
      "I could use a tiny nap.",
      "Yawn... I’m trying to stay awake."
    ]);
  }

  if (npc.mood === "bored") {
    if (/\b(play|hang out|fun|game|dance)\b/.test(text)) {
      return pick([
        "Yes please! Let’s do something fun.",
        "That sounds perfect for my mood.",
        "I’d love that!"
      ]);
    }
    return pick([
      "I’m a little bored...",
      "I could use something fun to do.",
      "Maybe we should do something together."
    ]);
  }

  if (npc.mood === "silly") {
    return pick([
      "Hehe, I’m feeling extra goofy today.",
      "I can’t stop smiling right now.",
      "I’m in a silly mood today!"
    ]);
  }

  return personality.mood[npc.mood] || null;
}

function buildNpcReply(npc, message) {
  const text = normalizeText(message);
  const personality = PERSONALITY[npc.personality] || PERSONALITY.bubbly;

  if (!text) return pick(personality.neutral);

  if (/\b(hi|hello|hey|yo)\b/.test(text)) {
    return pick(personality.greetings);
  }

  if (/\b(outfit|dress|look|style|clothes|clothing)\b/.test(text)) {
    if (npc.relationship > 60) {
      return pick([
        "Aww, you always notice my style. I like that.",
        "You always pick such cute outfits for me to imagine.",
        "You really do have good taste."
      ]);
    }
    return pick(personality.compliments);
  }

  if (/\b(friend|best friend|hang out|play together|spend time)\b/.test(text)) {
    if (npc.relationship > 60) {
      return pick([
        "Bestie vibes for sure.",
        "I’d love to hang out with you all day.",
        "You’re one of my favorite people."
      ]);
    }
    return pick([
      "I’d like that a lot.",
      "Let’s hang out sometime!",
      "I think that would be fun."
    ]);
  }

  if (/\b(town|park|cafe|beach|library|gym|shop|school|home)\b/.test(text)) {
    const location = currentRoom === "home" ? "home" : roomNames[currentRoom] || "the town";
    return pick([
      `I like ${location} too.`,
      `That place is really nice.`,
      `That sounds like a fun place to go.`,
      `I’d enjoy hanging out there.`
    ]);
  }

  if (/\b(job|work|school|study|career)\b/.test(text)) {
    if (npc.job) {
      return pick([
        `I’m thinking about my ${npc.job} stuff too.`,
        `It’s nice to have a job, right?`,
        `I like being busy sometimes.`
      ]);
    }
    return pick([
      "I like having things to do.",
      "It feels nice to have a routine.",
      "A little work can be fun."
    ]);
  }

  if (/\b(feel|mood|how are you|how are you doing|are you okay)\b/.test(text)) {
    return personality.mood[npc.mood] || pick(personality.neutral);
  }

  if (/\b(love|like|cute|adorable|pretty|nice|amazing)\b/.test(text)) {
    if (npc.relationship > 60) {
      return pick([
        "Aww, I like you too.",
        "You always make me smile.",
        "That makes me really happy."
      ]);
    }
    return pick([
      "That makes me blush a little.",
      "Aww, thank you!",
      "That’s really sweet."
    ]);
  }

  if (/\?/.test(text)) {
    return pick(personality.questions);
  }

  const moodReply = getMoodReply(npc, message);
  if (moodReply) return moodReply;

  if (Math.random() < 0.4) {
    return pick(personality.neutral);
  }

  return pick([
    "Tell me more!",
    "That sounds interesting.",
    "I like that idea.",
    "You always say the cutest things.",
    "Hehe, I’m listening."
  ]);
}

function renderNpcList() {
  const listEl = document.getElementById("npc-list");
  if (!listEl) return;

  listEl.innerHTML = "";
  npcs.forEach((npc, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "npc-option" + (index === selectedNpcIndex ? " active" : "");
    btn.textContent = `${npc.name} · ${npc.relationship}%`;
    btn.addEventListener("click", () => setSelectedNpc(index));
    listEl.appendChild(btn);
  });
}

function renderChatLog() {
  const chatLogEl = document.getElementById("chat-log");
  if (!chatLogEl) return;

  const npc = npcs[selectedNpcIndex];
  chatLogEl.innerHTML = "";

  const intro = document.createElement("div");
  intro.className = "chat-message system";
  intro.textContent = `${npc.name} is feeling ${npc.mood}.`;
  chatLogEl.appendChild(intro);

  (npc.history.length ? npc.history : [{ role: "assistant", text: pick(PERSONALITY[npc.personality].greetings) }]).forEach((entry) => {
    const row = document.createElement("div");
    row.className = `chat-message ${entry.role}`;
    row.textContent = entry.text;
    chatLogEl.appendChild(row);
  });

  chatLogEl.scrollTop = chatLogEl.scrollHeight;
}

function setSelectedNpc(index) {
  selectedNpcIndex = index;
  renderNpcList();
  renderChatLog();
}

function sendChatMessage() {
  const inputEl = document.getElementById("chat-input");
  const text = (inputEl && inputEl.value || "").trim();
  if (!text) return;

  const npc = npcs[selectedNpcIndex];
  npc.history.push({ role: "user", text });

  const moodText = normalizeText(text);
  if (/\b(tired|sleepy|nap|yawn)\b/.test(moodText)) npc.mood = "sleepy";
  else if (/\b(hungry|snack|eat|food|pizza|cake)\b/.test(moodText)) npc.mood = "hungry";
  else if (/\b(bored|nothing to do|boring|play)\b/.test(moodText)) npc.mood = "bored";
  else if (/\b(funny|goofy|silly|joke)\b/.test(moodText)) npc.mood = "silly";
  else npc.mood = "happy";

  const reply = buildNpcReply(npc, text);
  npc.history.push({ role: "assistant", text: reply });
  npc.relationship = clamp(npc.relationship + 5, 0, 100);
  npc.memory.push({ user: text, reply });
  npc.memory = npc.memory.slice(-6);

  if (inputEl) inputEl.value = "";
  renderNpcList();
  renderChatLog();
}

function saveState() {
  const state = { avatarState, coins, currentRoom, avatarX, avatarY };
  localStorage.setItem("dreamlife-village-save", JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem("dreamlife-village-save");
  if (!raw) return;

  try {
    const state = JSON.parse(raw);
    if (state.avatarState) Object.assign(avatarState, state.avatarState);
    if (typeof state.coins === "number") coins = state.coins;
    if (state.currentRoom) currentRoom = state.currentRoom;
    if (typeof state.avatarX === "number") avatarX = state.avatarX;
    if (typeof state.avatarY === "number") avatarY = state.avatarY;
  } catch (err) {
    console.log("Save data was invalid, starting fresh.");
  }
}

function renderSwatches(group, selectedValue) {
  const container = document.getElementById(`${group}-options`);
  if (!container) return;
  container.innerHTML = "";

  items[group].forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "swatch " + (selectedValue === item.value ? "active" : "");
    btn.title = item.name;
    btn.style.background = item.color;
    btn.addEventListener("click", () => {
      avatarState[group] = item.value;
      updateAvatar();
      renderSwatches(group, item.value);
      saveState();
    });
    container.appendChild(btn);
  });
}

function updateAvatar() {
  const hairColor = items.hair.find(i => i.value === avatarState.hair)?.color || "#2b1d29";
  const skinColor = items.skin.find(i => i.value === avatarState.skin)?.color || "#f7d8bf";
  const topColor = items.top.find(i => i.value === avatarState.top)?.color || "#ffb7d8";
  const bottomColor = items.bottom.find(i => i.value === avatarState.bottom)?.color || "#86d0ff";
  const accessoryValue = avatarState.accessory;
  const accessoryEl = document.getElementById("accessory");

  document.getElementById("head").style.background = skinColor;
  document.getElementById("hair").style.background = hairColor;
  document.getElementById("body").style.background = topColor;
  document.getElementById("legs").style.background = bottomColor;

  const hair = document.getElementById("hair");
  hair.style.background = hairColor;
  hair.style.borderRadius = "54% 46% 34% 34%";

  accessoryEl.className = "accessory";
  if (accessoryValue === "none") {
    accessoryEl.style.opacity = "0";
    accessoryEl.style.width = "0";
    accessoryEl.style.height = "0";
  } else {
    accessoryEl.classList.add(accessoryValue);
    accessoryEl.style.opacity = "1";
    accessoryEl.style.left = "50%";
    accessoryEl.style.top = "10px";
    accessoryEl.style.transform = "translateX(-50%)";
  }
}

function renderInventory() {
  inventoryEl.innerHTML = "";
  inventory.forEach((item) => {
    const el = document.createElement("div");
    el.className = "inventory-item";
    el.textContent = item;
    inventoryEl.appendChild(el);
  });
}

function addCoins(amount) {
  coins += amount;
  coinsEl.textContent = coins;
  saveState();
}

function setRoom(roomKey) {
  currentRoom = roomKey;
  document.querySelectorAll(".room").forEach((room) => room.classList.remove("active"));
  document.getElementById(`room-${roomKey}`).classList.add("active");

  document.querySelectorAll(".room-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.room === roomKey);
  });

  const roomLabel = roomNames[roomKey] || "Home";
  moodEl.textContent = roomLabel === "Park" ? "Playful" : roomLabel === "Cafe" ? "Cozy" : roomLabel === "Style Shop" ? "Stylish" : "Happy";
  saveState();
}

function updateAvatarPosition() {
  const maxX = 480;
  const maxY = 380;
  const clampedX = Math.min(maxX, Math.max(40, avatarX));
  const clampedY = Math.min(maxY, Math.max(80, avatarY));

  avatarEl.style.left = `${clampedX}px`;
  avatarEl.style.top = `${clampedY}px`;
}

function moveAvatar(dx, dy) {
  avatarX += dx;
  avatarY += dy;
  updateAvatarPosition();
  saveState();
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();
  if (key === "arrowleft" || key === "a") moveAvatar(-20, 0);
  if (key === "arrowright" || key === "d") moveAvatar(20, 0);
  if (key === "arrowup" || key === "w") moveAvatar(0, -20);
  if (key === "arrowdown" || key === "s") moveAvatar(0, 20);
}

document.getElementById("gacha-btn").addEventListener("click", () => {
  const typeRoll = ["hair", "top", "bottom", "accessory"][Math.floor(Math.random() * 4)];
  const prize = items[typeRoll][Math.floor(Math.random() * items[typeRoll].length)];
  inventory.push(prize.name);
  addCoins(25);

  const moodText = prize.name.includes("Pink") || prize.name.includes("Star") ? "Excited" : "Joyful";
  moodEl.textContent = moodText;
  renderInventory();
  saveState();
});

document.getElementById("dress-up-btn").addEventListener("click", () => {
  moodEl.textContent = "Stylish";
  addCoins(10);
  saveState();
});

function startMiniGame() {
  if (miniGameActive) return;

  miniGameActive = true;
  timer = 20;
  score = 0;
  timerEl.textContent = `Time: ${timer}`;
  scoreEl.textContent = `Score: ${score}`;

  miniGameArea.querySelectorAll(".star").forEach(star => star.remove());

  spawnStar();

  timerId = setInterval(() => {
    timer--;
    timerEl.textContent = `Time: ${timer}`;

    if (timer <= 0) {
      clearInterval(timerId);
      miniGameActive = false;
      addCoins(score * 2);
      moodEl.textContent = "Happy";
      return;
    }

    if (Math.random() < 0.45) spawnStar();
  }, 1000);
}

function spawnStar() {
  const star = document.createElement("div");
  star.className = "star";

  const x = Math.random() * (miniGameArea.clientWidth - 30);
  const y = Math.random() * (miniGameArea.clientHeight - 30);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  star.addEventListener("click", () => {
    if (!miniGameActive) return;
    score++;
    scoreEl.textContent = `Score: ${score}`;
    star.remove();
    spawnStar();
  });

  miniGameArea.appendChild(star);
}

document.getElementById("mini-game-btn").addEventListener("click", startMiniGame);
document.querySelectorAll(".room-btn").forEach((button) => {
  button.addEventListener("click", () => setRoom(button.dataset.room));
});

document.addEventListener("keydown", handleKeydown);

const chatInput = document.getElementById("chat-input");
const chatSendBtn = document.getElementById("chat-send");
if (chatInput && chatSendBtn) {
  chatSendBtn.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendChatMessage();
  });
}

Object.keys(items).forEach((key) => renderSwatches(key, avatarState[key]));
loadState();
updateAvatar();
updateAvatarPosition();
renderInventory();
setRoom(currentRoom);
coinsEl.textContent = coins;
renderNpcList();
renderChatLog();
