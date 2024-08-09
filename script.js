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

// Función para cargar las sesiones de DJ
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
  sessionsGrid.innerHTML = ""; // Limpiar contenido previo

  sessionNames.forEach((fileName, index) => {
    const sessionBox = document.createElement("div");
    sessionBox.className = "session-box";
    sessionBox.textContent = `Sesión ${index + 1}`;
    sessionBox.dataset.src = `sessions/${fileName}`;
    sessionBox.dataset.index = index; // Añade el índice

    sessionBox.addEventListener("click", playSession);

    sessionsGrid.appendChild(sessionBox);
  });
}

// Función para manejar la reproducción de una sesión
function playSession(event) {
  const sessionSrc = event.currentTarget.dataset.src;
  const audioElement = document.getElementById("audio");
  const audioSource = document.getElementById("audio-source");
  const sessionTitle = document.getElementById("session-title");

  // Cambiar la fuente del audio
  audioSource.src = sessionSrc;
  audioElement.load();

  // No reproducir hasta que se presione el botón de reproducción
  document.getElementById("play-btn").style.display = "inline-block";
  document.getElementById("pause-btn").style.display = "none";

  sessionTitle.textContent = `Reproduciendo: ${sessionSrc
    .split("/")
    .pop()
    .replace(".mp3", "")}`;

  document.getElementById("player-container").style.display = "block";

  // Marcar la sesión seleccionada
  const allSessionBoxes = document.querySelectorAll(".session-box");
  allSessionBoxes.forEach((box) => box.classList.remove("selected"));
  event.currentTarget.classList.add("selected");

  // Guarda la pista actual en el contexto global
  window.currentSessionIndex = parseInt(event.currentTarget.dataset.index);
}

// Función para configurar los controles del reproductor
function setupPlayerControls() {
  const audioElement = document.getElementById("audio");
  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");

  playBtn.addEventListener("click", () => {
    audioElement.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
  });

  pauseBtn.addEventListener("click", () => {
    audioElement.pause();
    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  });

  audioElement.addEventListener("ended", () => {
    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    changeTrack(-1);
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    changeTrack(1);
  });
}

// Función para cambiar de pista
function changeTrack(direction) {
  const sessionBoxes = document.querySelectorAll(".session-box");
  const newIndex =
    (window.currentSessionIndex + direction + sessionBoxes.length) %
    sessionBoxes.length;
  sessionBoxes[newIndex].click(); // Simula el click para cambiar la pista
}
