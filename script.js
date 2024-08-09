document.addEventListener("DOMContentLoaded", () => {
  // Verifica si hay una sesión activa
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-container").style.display = "block";
    loadSessions();
    setupPlayerControls();
  } else {
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("main-container").style.display = "none";
  }

  // Configura el botón de inicio de sesión
  document.getElementById("login-btn").addEventListener("click", () => {
    const accessCode = document.getElementById("access-code").value;
    if (accessCode === "dj") {
      sessionStorage.setItem("loggedIn", "true");
      document.getElementById("login-container").style.display = "none";
      document.getElementById("main-container").style.display = "block";
      loadSessions();
      setupPlayerControls();
    } else {
      document.getElementById("error-message").textContent =
        "Código incorrecto. Inténtalo de nuevo.";
    }
  });

  // Configura el botón de logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "index.html"; // Ajusta la ruta si es necesario
  });
});

function loadSessions() {
  const sessionNames = [
    "cancion1.mp3",
    "cancion2.mp3",
    "cancion3.mp3",
    "cancion4.mp3",
    "cancion5.mp3",
    "cancion6.mp3",
    "cancion7.mp3",
  ];

  const sessionsGrid = document.getElementById("sessions-grid");
  sessionsGrid.innerHTML = "";

  sessionNames.forEach((fileName, index) => {
    const sessionBox = document.createElement("div");
    sessionBox.className = "session-box";
    sessionBox.textContent = `Sesión ${index + 1}`;
    sessionBox.dataset.src = `sessions/${fileName}`;
    sessionBox.dataset.index = index;
    sessionBox.addEventListener("click", playSession);
    sessionsGrid.appendChild(sessionBox);
  });

  window.sessions = sessionNames;
}

function playSession(event) {
  const sessionSrc = event.currentTarget.dataset.src;
  const audioElement = document.getElementById("audio");
  const audioSource = document.getElementById("audio-source");
  const sessionTitle = document.getElementById("session-title");

  audioSource.src = sessionSrc;
  audioElement.load();

  document.getElementById("play-btn").style.display = "inline-block";
  document.getElementById("pause-btn").style.display = "none";

  sessionTitle.textContent = `Reproduciendo: ${sessionSrc
    .split("/")
    .pop()
    .replace(".mp3", "")}`;

  document.getElementById("player-container").style.display = "block";

  document.querySelectorAll(".session-box").forEach((box) => {
    box.classList.remove("active-session");
  });
  event.currentTarget.classList.add("active-session");

  window.currentSessionIndex = parseInt(event.currentTarget.dataset.index);
}

function setupPlayerControls() {
  const audioElement = document.getElementById("audio");

  document.getElementById("play-btn").addEventListener("click", () => {
    audioElement.play();
    document.getElementById("play-btn").style.display = "none";
    document.getElementById("pause-btn").style.display = "inline-block";
  });

  document.getElementById("pause-btn").addEventListener("click", () => {
    audioElement.pause();
    document.getElementById("play-btn").style.display = "inline-block";
    document.getElementById("pause-btn").style.display = "none";
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    changeSession(1);
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    changeSession(-1);
  });

  document.getElementById("forward-btn").addEventListener("click", () => {
    if (audioElement) {
      audioElement.currentTime += 30;
    }
  });

  document.getElementById("backward-btn").addEventListener("click", () => {
    if (audioElement) {
      audioElement.currentTime -= 30;
    }
  });
}

function changeSession(direction) {
  const sessions = window.sessions || [];
  let currentIndex = window.currentSessionIndex || 0;
  currentIndex += direction;

  if (currentIndex >= 0 && currentIndex < sessions.length) {
    const nextSessionSrc = `sessions/${sessions[currentIndex]}`;
    const audioElement = document.getElementById("audio");
    const audioSource = document.getElementById("audio-source");
    const sessionTitle = document.getElementById("session-title");

    audioSource.src = nextSessionSrc;
    audioElement.load();
    audioElement.play();

    sessionTitle.textContent = `Reproduciendo: ${sessions[currentIndex].replace(
      ".mp3",
      ""
    )}`;
    document.getElementById("play-btn").style.display = "none";
    document.getElementById("pause-btn").style.display = "inline-block";

    window.currentSessionIndex = currentIndex;
  }
}
