document.addEventListener("DOMContentLoaded", () => {
  const sessionsGrid = document.getElementById("sessions-grid");
  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const audio = document.getElementById("audio");
  const audioSource = document.getElementById("audio-source");
  const sessionTitle = document.getElementById("session-title");
  const prevBtn = document.getElementById("prev-btn");
  const backwardBtn = document.getElementById("backward-btn");
  const forwardBtn = document.getElementById("forward-btn");
  const nextBtn = document.getElementById("next-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginBtn = document.getElementById("login-btn");
  const accessCodeInput = document.getElementById("access-code");
  const errorMessage = document.getElementById("error-message");

  let currentSessionIndex = null;
  let sessionNames = [];

  // Verifica si hay una sesión activa
  const isLoggedIn = sessionStorage.getItem("loggedIn") === "true";

  // Muestra u oculta el contenido principal según el estado de inicio de sesión
  if (isLoggedIn) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-container").style.display = "flex";
    loadSessions(); // Carga sesiones cuando el usuario está logueado
  } else {
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("main-container").style.display = "none";
  }

  // Función para manejar el botón de play
  function playAudio() {
    audio.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
  }

  // Función para manejar el botón de pause
  function pauseAudio() {
    audio.pause();
    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  }

  // Función para manejar la reproducción de una sesión
  function playSession(event) {
    const sessionSrc = event.currentTarget.dataset.src;
    audioSource.src = sessionSrc;
    audio.load(); // Recarga la fuente de audio
    playAudio();

    // Actualiza la UI para la sesión actual
    sessionTitle.textContent = `Reproduciendo: ${sessionSrc
      .split("/")
      .pop()
      .replace(".mp3", "")}`;
    document.getElementById("player-container").style.display = "block";

    // Elimina la clase activa de todas las sesiones y agrégala a la sesión actual
    sessionsGrid
      .querySelectorAll(".session-box")
      .forEach((box) => box.classList.remove("active-session"));
    event.currentTarget.classList.add("active-session");

    currentSessionIndex = parseInt(event.currentTarget.dataset.index, 10);
  }

  // Función para cargar sesiones dinámicamente
  function loadSessions() {
    sessionNames = [
      "cancion1.mp3",
      "cancion2.mp3",
      "cancion3.mp3",
      "cancion4.mp3",
      "cancion5.mp3",
      "cancion6.mp3",
      "cancion7.mp3",
    ];

    sessionsGrid.innerHTML = ""; // Limpiar contenido previo

    sessionNames.forEach((fileName, index) => {
      const sessionBox = document.createElement("div");
      sessionBox.className = "session-box";
      sessionBox.textContent = `Sesión ${index + 1}`;
      sessionBox.dataset.src = `sessions/${fileName}`;
      sessionBox.dataset.index = index; // Guarda el índice de la sesión
      sessionBox.addEventListener("click", playSession);
      sessionsGrid.appendChild(sessionBox);
    });
  }

  // Funcionalidad de los botones de reproducción/pausa
  playBtn.addEventListener("click", playAudio);
  pauseBtn.addEventListener("click", pauseAudio);

  // Botones de avance/retroceso
  backwardBtn.addEventListener("click", () => {
    audio.currentTime = Math.max(audio.currentTime - 30, 0);
  });

  forwardBtn.addEventListener("click", () => {
    audio.currentTime += 30;
  });

  // Botones de sesión anterior/siguiente
  prevBtn.addEventListener("click", () => {
    if (currentSessionIndex > 0) {
      sessionsGrid
        .querySelectorAll(".session-box")
        [currentSessionIndex - 1].click();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (
      currentSessionIndex <
      sessionsGrid.querySelectorAll(".session-box").length - 1
    ) {
      sessionsGrid
        .querySelectorAll(".session-box")
        [currentSessionIndex + 1].click();
    }
  });

  // Funcionalidad del botón de logout
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    document.getElementById("main-container").style.display = "none";
    document.getElementById("login-container").style.display = "flex";
    pauseAudio(); // Pausa el audio al cerrar sesión
  });

  // Funcionalidad del botón de login
  loginBtn.addEventListener("click", () => {
    const accessCode = accessCodeInput.value.trim();
    if (accessCode === "dj") {
      // Cambia esto por tu código de acceso real
      sessionStorage.setItem("loggedIn", "true");
      document.getElementById("login-container").style.display = "none";
      document.getElementById("main-container").style.display = "flex";
      loadSessions(); // Carga sesiones después de iniciar sesión
    } else {
      errorMessage.textContent = "Código de acceso incorrecto.";
    }
  });
});
