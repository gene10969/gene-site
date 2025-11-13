
document.addEventListener("DOMContentLoaded", () => {
  initGeneLoader();
  initGeneParticles();
});

// トップページだけのローディング演出
function initGeneLoader() {
  const body = document.body;
  if (!body.classList.contains("with-loader")) return;

  const loader = document.createElement("div");
  loader.id = "gene-loader";
  loader.innerHTML = '<div class="loader-circle"></div>';
  document.body.appendChild(loader);

  const totalTime = 1600;
  setTimeout(() => {
    loader.classList.add("is-fading");
    setTimeout(() => {
      loader.remove();
    }, 900);
  }, totalTime);
}

// 全ページ共通のキラキラ粒子
function initGeneParticles() {
  const body = document.body;
  const container = document.createElement("div");
  container.className = "gene-particles";

  const PARTICLE_COUNT = 28;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("span");
    p.className = "particle";

    const left = Math.random() * 100;
    const scale = 0.4 + Math.random() * 0.8;
    const duration = 7 + Math.random() * 6;
    const delay = Math.random() * -duration;

    p.style.left = left + "%";
    p.style.transform = `scale(${scale})`;
    p.style.animationDuration = duration + "s";
    p.style.animationDelay = delay + "s";

    container.appendChild(p);
  }

  body.appendChild(container);
}
