// ===========================
//        LÓGICA DO JOGO
// ===========================

// Variáveis principais do jogo
let currentQuestion = { number1: 0, number2: 0, answer: 0 }; // Guarda a pergunta atual
let score = 0; // Pontuação do jogador
let timeRemaining = 60; // Tempo inicial do jogo
let timerInterval; // Referência para o timer
let timerStarted = false; // Impede que o timer inicie mais de uma vez
let fireworkActive = false; // Controla se os fogos devem aparecer

// Inicia o jogo e gera a primeira pergunta
function startGame() {
  generateQuestion();
}

// Gera uma nova pergunta de multiplicação entre 1 e 10
function generateQuestion() {
  const number1 = Math.floor(Math.random() * 10) + 1;
  const number2 = Math.floor(Math.random() * 10) + 1;
  currentQuestion = { number1, number2, answer: number1 * number2 };

  // Atualiza a pergunta no HTML
  document.getElementById("question").innerText = `Quanto é ${number1} x ${number2}?`;
  document.getElementById("answer").value = "";
  document.getElementById("result").innerText = "";
}

// Inicia o cronômetro de 60 segundos
function startTimer() {
  document.getElementById("timer").innerText = `Tempo: ${timeRemaining}s`;
  timerInterval = setInterval(() => {
    timeRemaining--;
    document.getElementById("timer").innerText = `Tempo: ${timeRemaining}s`;

    // Quando o tempo acabar, finaliza o jogo
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// Verifica a resposta do jogador
function checkAnswer() {
  const userAnswer = parseInt(document.getElementById("answer").value);

  // Inicia o timer na primeira resposta
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  // Verifica se a resposta está correta
  if (userAnswer === currentQuestion.answer) {
    // Resposta correta: aumenta pontuação e ativa fogos
    score += 5;
    document.getElementById("result").innerText = "Resposta correta! 👍";
    document.getElementById("result").classList.add("correct");
    document.getElementById("result").classList.remove("incorrect");

    fireworkActive = true; // Liga fogos
    launchFirework(); // Lança um na hora
  } else {
    // Resposta errada: mostra alerta com a resposta correta e desliga fogos
    alert(`Errou! A resposta correta era ${currentQuestion.answer}.`);
    document.getElementById("result").innerText = `Resposta incorreta! A resposta certa era ${currentQuestion.answer}. 😞`;
    document.getElementById("result").classList.add("incorrect");
    document.getElementById("result").classList.remove("correct");

    fireworkActive = false; // Desliga fogos
  }

  // Atualiza pontuação e gera nova pergunta
  document.getElementById("score").innerText = `Pontuação: ${score}`;
  generateQuestion();
}

// Finaliza o jogo, desativa tudo
function endGame() {
  clearInterval(timerInterval);
  document.getElementById("answer").disabled = true;
  document.getElementById("finalResult").innerText = `Sua pontuação final é: ${score}`;
  fireworkActive = false;
}

// Reinicia o jogo
function resetGame() {
  clearInterval(timerInterval);
  score = 0;
  timeRemaining = 60;
  timerStarted = false;
  fireworkActive = false;

  document.getElementById("answer").disabled = false;
  document.getElementById("score").innerText = `Pontuação: ${score}`;
  document.getElementById("timer").innerText = `Tempo: ${timeRemaining}s`;
  document.getElementById("finalResult").innerText = "";
  generateQuestion();
}

startGame(); // Começa assim que a página carregar

// ===========================
//     FOGOS DE ARTIFÍCIO
// ===========================

// Configura o canvas
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Classe Firework que cria partículas animadas
class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.particles = [];

    // Cria partículas com direções aleatórias
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 5,
        dy: (Math.random() - 0.5) * 5,
        alpha: 1
      });
    }
  }

  // Atualiza as posições das partículas e diminui a opacidade
  update() {
    this.particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= 0.02;
    });

    // Remove as que desapareceram
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  // Desenha as partículas na tela
  draw() {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}

let fireworks = []; // Lista de fogos ativos

// Cria e adiciona um novo fogo
function launchFirework() {
  fireworks.push(new Firework(
    Math.random() * canvas.width,
    Math.random() * canvas.height / 2,
    `hsl(${Math.random() * 360}, 100%, 50%)`
  ));
}

// Lança fogos em intervalo apenas se estiverem ativados
setInterval(() => {
  if (fireworkActive) {
    launchFirework();
  }
}, 800);

// Loop de animação que mantém os fogos rodando
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela
  fireworks.forEach(f => {
    f.update(); // Atualiza
    f.draw(); // Desenha
  });

  // Remove fogos que acabaram
  fireworks = fireworks.filter(f => f.particles.length > 0);
  requestAnimationFrame(animate); // Próximo frame
}

animate(); // Inicia animação contínua dos fogos
