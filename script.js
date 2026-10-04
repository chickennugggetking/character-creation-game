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

Object.keys(items).forEach((key) => renderSwatches(key, avatarState[key]));
loadState();
updateAvatar();
updateAvatarPosition();
renderInventory();
setRoom(currentRoom);
coinsEl.textContent = coins;
