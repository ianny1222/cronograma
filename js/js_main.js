// Lista Padrão de Componentes Curriculares
const materiasPadrao = [
    "Português", "Matemática", "História", "Geografia", "Física", 
    "Química", "Sociologia", "Filosofia", "Inglês", "Espanhol", 
    "Redação", "Artes", "Simulados"
];

// Inicialização segura baseada no LocalStorage ou Padrão
let minhasMaterias = JSON.parse(localStorage.getItem('nu_materias')) || materiasPadrao;

document.addEventListener("DOMContentLoaded", () => {
    renderMaterias();

    const form = document.getElementById("form-materia");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = document.getElementById("nome-materia");
            const novaMateria = input.value.trim();

            if (novaMateria && !minhasMaterias.includes(novaMateria)) {
                minhasMaterias.push(novaMateria);
                localStorage.setItem('nu_materias', JSON.stringify(minhasMaterias));
                renderMaterias();
                input.value = "";
            }
        });
    }
});

function renderMaterias() {
    const container = document.getElementById("lista-materias");
    if (!container) return;
    
    container.innerHTML = "";
    minhasMaterias.forEach(mat => {
        const span = document.createElement("span");
        span.className = "tag";
        span.innerText = mat;
        container.appendChild(span);
    });
}

// Inserção simulada na tabela semanal (para a página de cronograma)
function addMateriaAoDia(dia) {
    const materiaEscolhida = prompt(`Escolha uma matéria:\n${minhasMaterias.join(", ")}`);
    if (!materiaEscolhida || !minhasMaterias.includes(materiaEscolhida)) return;

    const horario = prompt("Defina o horário de funcionamento (Ex: 14:00 às 15:00):");
    if (!horario) return;

    const containerDia = document.getElementById(`tasks-${dia}`);
    if (containerDia) {
        const div = document.createElement("div");
        div.className = "materia-agendada";
        div.innerHTML = `<strong>${materiaEscolhida}</strong> <span>⏰ ${horario}</span>`;
        containerDia.appendChild(div);
    }
}
let countdown;
let timerTargetMinutes = 60; // Limite padrão de 60 min
let secondsLeft = timerTargetMinutes * 60;
let isRunning = false;

document.addEventListener("DOMContentLoaded", () => {
    // Inicializa Relógio Geral
    setInterval(updateLiveClock, 1000);
    updateLiveClock();

    // Elementos do Timer
    const display = document.getElementById("timer-display");
    const inputMinutos = document.getElementById("timer-input");
    const btnStart = document.getElementById("btn-start");
    const btnReset = document.getElementById("btn-reset");

    if (display) {
        inputMinutos.addEventListener("change", (e) => {
            let val = parseInt(e.target.value);
            if (val > 60) val = 60; // Garante o limite estabelecido de 60min
            if (val < 1) val = 1;
            e.target.value = val;
            timerTargetMinutes = val;
            if (!isRunning) resetTimer();
        });

        btnStart.addEventListener("click", () => {
            if (isRunning) {
                clearInterval(countdown);
                btnStart.innerText = "Iniciar";
                btnStart.style.backgroundColor = "var(--primary-red)";
            } else {
                startTimer();
                btnStart.innerText = "Pausar";
                btnStart.style.backgroundColor = "#ffbf00"; // tom de aviso/pausa
            }
            isRunning = !isRunning;
        });

        btnReset.addEventListener("click", resetTimer);
    }
});

function updateLiveClock() {
    const clockEl = document.getElementById("live-clock");
    if (!clockEl) return;
    const agora = new Date();
    clockEl.innerText = "Horário de Brasília: " + agora.toLocaleTimeString("pt-BR");
}

function startTimer() {
    clearInterval(countdown);
    const display = document.getElementById("timer-display");

    countdown = setInterval(() => {
        secondsLeft--;
        
        if (secondsLeft < 0) {
            clearInterval(countdown);
            display.innerText = "FIM! 🚨";
            dispararAlarme();
            return;
        }

        displayTime(secondsLeft);
    }, 1000);
}

function resetTimer() {
    clearInterval(countdown);
    isRunning = false;
    secondsLeft = timerTargetMinutes * 60;
    displayTime(secondsLeft);
    const btnStart = document.getElementById("btn-start");
    if (btnStart) btnStart.innerText = "Iniciar";
}

function displayTime(seconds) {
    const display = document.getElementById("timer-display");
    if (!display) return;
    const mins = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    display.innerText = `${mins < 10 ? '0' : ''}${mins}:${remSeconds < 10 ? '0' : ''}${remSeconds}`;
}

function dispararAlarme() {
    // Efeito sonoro nativo do navegador usando AudioContext (dispensa arquivos externos)
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, context.currentTime); // Tom do alarme
    osc.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 1.5); // Toca por 1.5 segundos
    alert("Limite de tempo atingido para a sua matéria atual! Alarme ativo.");
}