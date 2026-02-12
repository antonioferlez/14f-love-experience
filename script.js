const countdown = document.getElementById("countdown");
const envelope = document.getElementById("envelope");
const warning = document.getElementById("warning");
const paper = document.querySelector(".paper");

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

// Audio elements
const audioPlayer = document.getElementById("audioPlayer");
const audioElement = document.getElementById("audioElement");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const targetDate = new Date("2026-02-14T00:00:00").getTime();
let unlocked = false;
let autoCloseTimeout = null;

/* ======================
   INICIAR PAPEL BLOQUEADO
====================== */

paper.classList.add("locked-paper");

/* ======================
   CUENTA REGRESIVA
====================== */

const interval = setInterval(() => {

    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
        clearInterval(interval);
        countdown.innerHTML = "<div style='font-family: Poppins, sans-serif; font-size: clamp(1.5rem, 4vw, 2rem); color: #000000; font-weight: 500;'>¡La espera terminó!</div>";
        unlockEnvelope();
        startFireworks();
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

}, 1000);

/* ======================
   DESBLOQUEAR
====================== */

function unlockEnvelope() {
    unlocked = true;

    envelope.classList.remove("locked");
    envelope.classList.add("unlocked");

    paper.classList.remove("locked-paper");
    paper.classList.add("unlocked-paper");
    
    // Habilitar el botón de audio
    playPauseBtn.disabled = false;
}

/* ======================
   ABRIR Y CERRAR SOBRE
====================== */

envelope.addEventListener("click", () => {

    if (!unlocked) {
        warning.classList.remove("hidden");
        setTimeout(() => warning.classList.add("hidden"), 2000);
        return;
    }

    if (envelope.classList.contains("open")) return;

    envelope.classList.add("open");

    autoCloseTimeout = setTimeout(() => {
        envelope.classList.remove("open");
    }, 10000);
});

/* ======================
   AUDIO PLAYER
====================== */

// Formatear tiempo (segundos a mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Cargar metadatos del audio
audioElement.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioElement.duration);
});

// Actualizar tiempo actual
audioElement.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
});

// Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (audioElement.paused) {
        audioElement.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        audioPlayer.classList.add('playing');
    } else {
        audioElement.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        audioPlayer.classList.remove('playing');
    }
});

// Cuando termina el audio
audioElement.addEventListener('ended', () => {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    audioPlayer.classList.remove('playing');
    audioElement.currentTime = 0;
});

/* ======================
   FUEGOS ARTIFICIALES CON CORAZONES
====================== */

function startFireworks() {

    const particles = [];

    function createExplosion() {

        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;

        for (let i = 0; i < 40; i++) {

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;

            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 8 + 6,
                life: 80
            });
        }
    }

    function drawHeart(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2,
                          x - size, y + size / 3,
                          x, y + size);
        ctx.bezierCurveTo(x + size, y + size / 3,
                          x + size / 2, y - size / 2,
                          x, y);
        ctx.fillStyle = "#DC143C";
        ctx.fill();
    }

    function animate() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {

            p.x += p.vx;
            p.y += p.vy;

            p.vy += 0.05;
            p.life--;

            ctx.globalAlpha = p.life / 80;
            drawHeart(p.x, p.y, p.size);

            if (p.life <= 0) {
                particles.splice(index, 1);
            }
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    setInterval(createExplosion, 900);
    animate();
}