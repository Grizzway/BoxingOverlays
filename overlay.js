const ws = new WebSocket(`ws://${location.hostname}:3000`);

ws.onmessage = async (message) => {
  const data = JSON.parse(message.data);

  if (data.type === "toast") {
    showToast(data.message, data.duration);
    return;
  }

  const fighterData = await fetch("/fighters.json").then(r => r.json());
  const redFighter = fighterData.find(f => f.name === data.red);
  const blueFighter = fighterData.find(f => f.name === data.blue);

  if (redFighter && blueFighter) {
    playFightIntro({ red: redFighter, blue: blueFighter });
  }
};

function playFightIntro(data) {
  const overlay = document.getElementById("overlay");
  const leftBox = document.querySelector(".fighter.left");
  const rightBox = document.querySelector(".fighter.right");
  const vsImage = document.getElementById("vsImage");
  const bell = document.getElementById("bell");

  document.getElementById("leftImage").src = data.red.picture;
  document.getElementById("rightImage").src = data.blue.picture;
  document.getElementById("leftName").textContent = data.red.name;
  document.getElementById("rightName").textContent = data.blue.name;

  overlay.classList.remove("hidden");

  leftBox.style.animation = "slideInLeft 1s forwards";
  rightBox.style.animation = "slideInRight 1s forwards";
  vsImage.style.animation = "zoomInVs 1s ease-out forwards 1s";

  setTimeout(() => bell.play(), 2500);

  setTimeout(() => {
    leftBox.style.animation = "slideOutLeft 1s ease-in-out forwards";
    rightBox.style.animation = "slideOutRight 1s ease-in-out forwards";
    vsImage.style.animation = "zoomOutVs 1s ease-in-out forwards";
  }, 5000);

  setTimeout(() => {
    overlay.classList.add("hidden");
    leftBox.style.animation = "";
    rightBox.style.animation = "";
    vsImage.style.animation = "";
  }, 6000);
}

function showToast(message, duration) {
    let existing = document.getElementById("toastOverlay");
    if (existing) existing.remove();
  
    const toast = document.createElement("div");
    toast.id = "toastOverlay";
    toast.textContent = message;
  
    const audio = new Audio("pop.mp3");
    audio.play();
  
    toast.style.animation = `toastFadeIn 0.3s ease-out, toastFadeOut 0.5s ease-in ${duration - 500}ms forwards`;
  
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, duration + 500);
  }
  