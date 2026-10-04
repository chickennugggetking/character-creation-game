const avatarState = {
  hair: "brown",
  skin: "peach",
  top: "pink",
  bottom: "blue",
  accessory: "none"
};

const items = {
  hair: [
    { name: "Brown Bob", value: "brown", color: "#3c2d2d" },
    { name: "Blonde Waves", value: "blonde", color: "#e3c56b" },
    { name: "Pink Pony", value: "pink", color: "#ff7cb8" },
    { name: "Black Star", value: "black", color: "#1d1d1d" }
  ],
  skin: [
    { name: "Peach", value: "peach", color: "#f7d9bd" },
    { name: "Honey", value: "honey", color: "#d9a06d" },
    { name: "Chocolate", value: "choco", color: "#8f5b3d" },
    { name: "Fair", value: "fair", color: "#f8e4d6" }
  ],
  top: [
    { name: "Pink Tee", value: "pink", color: "#ffb7d8" },
    { name: "Purple Hoodie", value: "purple", color: "#af9bf8" },
    { name: "Mint Dress", value: "mint", color: "#9ef0bb" },
    { name: "Yellow Sweater", value: "yellow", color: "#ffd76a" }
  ],
  bottom: [
    { name: "Blue Skirt", value: "blue", color: "#8ccfff" },
    { name: "Jeans", value: "jean", color: "#6ab3ff" },
    { name: "Pink Shorts", value: "shorts", color: "#ff9fcb" },
    { name: "Orange Pants", value: "orange", color: "#f7b26a" }
  ],
  accessory: [
    { name: "None", value: "none", color: "#ffffff" },
    { name: "Star Clip", value: "star", color: "#ffd76a" },
    { name: "Bow", value: "bow", color: "#ff8dc7" },
    { name: "Heart Glasses", value: "glasses", color: "#98d8ff" }
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

let coins = 120;
let score = 0;
let miniGameActive = false;
let timer = 20;
let timerId = null;

function renderSwatches(group, selectedValue) {
  const container = document.getElementById(`${group}-options`);
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
    });
    container.appendChild(btn);
  });
}

function updateAvatar() {
  const hairEl = document.getElementById("hair");
  const bodyEl = document.getElementById("body");
  const legsEl = document.getElementById("legs");
  const accessoryEl = document.getElementById("accessory");

  const hairColor = items.hair.find(i => i.value === avatarState.hair)?.color || "#3c2d2d";
  const skinColor = items.skin.find(i => i.value === avatarState.skin)?.color || "#f7d9bd";
  const topColor = items.top.find(i => i.value === avatarState.top)?.color || "#ffb7d8";
  const bottomColor = items.bottom.find(i => i.value === avatarState.bottom)?.color || "#8ccfff";
  const accessoryColor = items.accessory.find(i => i.value === avatarState.accessory)?.color || "#ffffff";

  document.getElementById("head").style.background = skinColor;
  hairEl.style.background = hairColor;
  bodyEl.style.background = topColor;
  legsEl.style.background = bottomColor;

  if (avatarState.accessory === "none") {
    accessoryEl.style.opacity = 0;
    accessoryEl.style.background = "transparent";
  } else if (avatarState.accessory === "star") {
    accessoryEl.style.opacity = 1;
    accessoryEl.style.background = accessoryColor;
    accessoryEl.style.width = "80px";
    accessoryEl.style.height = "22px";
    accessoryEl.style.borderRadius = "999px";
  } else if (avatarState.accessory === "bow") {
    accessoryEl.style.opacity = 1;
    accessoryEl.style.background = accessoryColor;
    accessoryEl.style.width = "60px";
    accessoryEl.style.height = "20px";
    accessoryEl.style.borderRadius = "50%";
  } else if (avatarState.accessory === "glasses") {
    accessoryEl.style.opacity = 1;
    accessoryEl.style.background = accessoryColor;
    accessoryEl.style.width = "90px";
    accessoryEl.style.height = "22px";
    accessoryEl.style.borderRadius = "16px";
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

function getRandomItem(type) {
  const pool = items[type];
  return pool[Math.floor(Math.random() * pool.length)];
}

function addCoins(amount) {
  coins += amount;
  coinsEl.textContent = coins;
}

document.getElementById("gacha-btn").addEventListener("click", () => {
  const typeRoll = ["hair", "top", "bottom", "accessory"][Math.floor(Math.random() * 4)];
  const prize = getRandomItem(typeRoll);
  inventory.push(prize.name);
  addCoins(25);

  const moodText = prize.name.includes("Pink") || prize.name.includes("Star") ? "Excited" : "Joyful";
  moodEl.textContent = moodText;

  renderInventory();
});

document.getElementById("dress-up-btn").addEventListener("click", () => {
  moodEl.textContent = "Stylish";
  addCoins(10);
});

function startMiniGame() {
  if (miniGameActive) return;

  miniGameActive = true;
  timer = 20;
  score = 0;
  timerEl.textContent = `Time: ${timer}`;
  scoreEl.textContent = `Score: ${score}`;

  miniGameArea.querySelectorAll(".star").forEach(el => el.remove());

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

    if (Math.random() < 0.5) {
      spawnStar();
    }
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

Object.keys(items).forEach((key) => {
  renderSwatches(key, avatarState[key]);
});

updateAvatar();
renderInventory();
coinsEl.textContent = coins;
