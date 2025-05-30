document.addEventListener("DOMContentLoaded", async () => {
    const redCorner = document.getElementById("redCorner");
    const blueCorner = document.getElementById("blueCorner");
  
    const response = await fetch('/fighters.json');
    const fighters = await response.json();
  
    fighters.forEach((fighter, index) => {
      const redRadio = document.createElement('input');
      redRadio.type = 'radio';
      redRadio.name = 'redFighter';
      redRadio.value = fighter.name;
      redRadio.id = `red-${index}`;
  
      const redLabel = document.createElement('label');
      redLabel.htmlFor = redRadio.id;
      redLabel.textContent = fighter.name;
      redLabel.style.marginLeft = "5px";
  
      const redDiv = document.createElement('div');
      redDiv.className = 'fighter-option';
      redDiv.appendChild(redRadio);
      redDiv.appendChild(redLabel);
  
      redCorner.appendChild(redDiv);
  
      const blueRadio = document.createElement('input');
      blueRadio.type = 'radio';
      blueRadio.name = 'blueFighter';
      blueRadio.value = fighter.name;
      blueRadio.id = `blue-${index}`;
  
      const blueLabel = document.createElement('label');
      blueLabel.htmlFor = blueRadio.id;
      blueLabel.textContent = fighter.name;
      blueLabel.style.marginLeft = "5px";
  
      const blueDiv = document.createElement('div');
      blueDiv.className = 'fighter-option';
      blueDiv.appendChild(blueRadio);
      blueDiv.appendChild(blueLabel);
  
      blueCorner.appendChild(blueDiv);
    });
  
    document.getElementById("sendBtn").addEventListener("click", () => {
      const red = document.querySelector("input[name='redFighter']:checked")?.value;
      const blue = document.querySelector("input[name='blueFighter']:checked")?.value;
  
      if (!red || !blue) {
        alert("Please select one fighter for each corner.");
        return;
      }
  
      fetch("/set-fight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ red, blue })
      }).then(res => res.json()).then(data => {
        console.log("Fight set:", data);
      });
    });
  
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
      });
    });
  });
  
  document.getElementById("sendToastBtn").addEventListener("click", () => {
    const message = document.getElementById("toastText").value.trim();
    const duration = parseInt(document.getElementById("toastDuration").value);
  
    if (!message) {
      alert("Please enter a toast message.");
      return;
    }
  
    fetch("/send-toast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, duration })
    }).then(res => {
      if (res.ok) {
        document.getElementById("toastText").value = "";
      }
    });
  });
  