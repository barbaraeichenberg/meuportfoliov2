document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-target');
                bar.style.width = targetWidth;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
        observer.observe(bar);
    });
});
// =========================
// LOADING OVERLAY — wireframe cube slow spin + bar + phrases
// =========================
(() => {
  const overlay = document.getElementById("loadingOverlay");
  const canvas = document.getElementById("loadingCubeCanvas");
  const ctx = canvas?.getContext("2d");
  const barFill = document.getElementById("loadingBarFill");
  const textEl = document.getElementById("loadingText");

  if (!overlay || !canvas || !ctx || !barFill || !textEl) return;

  const W = canvas.width;
  const H = canvas.height;

  // Centraliza igual ao seu mock (um pouco acima do meio)
  const centerX = W * 0.5;
  const centerY = H * 0.44;

  // Tamanho do cubo
  const cubeSize = 260;

  // Ângulo: “de cima” igual seu mock
  let rotY = 0.22;      // yaw inicial
  const rotX = 0.22;    // pitch fixo (não muda)
  const spin = 0.004;   // giro beeem lento

  // Wireframe vertices
  const V = [
    {x:-1,y:-1,z:-1}, {x: 1,y:-1,z:-1}, {x: 1,y: 1,z:-1}, {x:-1,y: 1,z:-1},
    {x:-1,y:-1,z: 1}, {x: 1,y:-1,z: 1}, {x: 1,y: 1,z: 1}, {x:-1,y: 1,z: 1},
  ];
  const E = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ];

  function rotateY(p,a){
    const c=Math.cos(a), s=Math.sin(a);
    return { x: p.x*c + p.z*s, y: p.y, z: -p.x*s + p.z*c };
  }
  function rotateX(p,a){
    const c=Math.cos(a), s=Math.sin(a);
    return { x: p.x, y: p.y*c - p.z*s, z: p.y*s + p.z*c };
  }
  function project(p){
    const dist = 3.6;
    const z = p.z + dist;
    const scale = cubeSize / z;
    return { x: centerX + p.x * scale, y: centerY + p.y * scale };
  }

  function drawCube(){
    ctx.clearRect(0,0,W,H);

    // linhas finas estilo seu cubo
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.32)";

    const pts = V.map(v => {
      let p = rotateY(v, rotY);
      p = rotateX(p, rotX);
      return project(p);
    });

    ctx.beginPath();
    for (const [a,b] of E){
      ctx.moveTo(pts[a].x, pts[a].y);
      ctx.lineTo(pts[b].x, pts[b].y);
    }
    ctx.stroke();

    // brilho sutil (deixa mais “premium”)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.stroke();

    rotY += spin;
    requestAnimationFrame(drawCube);
  }
  requestAnimationFrame(drawCube);

  // frases
  const phrases = [
    "compilando wireframe...",
    "sincronizando interface...",
    "carregando projetos...",
    "otimizando cena...",
    "finalizando..."
  ];
  let phraseIdx = 0;
  const phraseTimer = setInterval(() => {
    phraseIdx = (phraseIdx + 1) % phrases.length;
    textEl.textContent = phrases[phraseIdx];
  }, 1400);

  // progresso fake bonito + mínimo de tempo
  let progress = 0;
  const startedAt = performance.now();
  const minShowMs = 900;

  function tickProgress(){
    const bump = progress < 70 ? (Math.random() * 10) : (Math.random() * 3.0);
    progress = Math.min(98, progress + bump);
    barFill.style.width = `${progress}%`;
    requestAnimationFrame(tickProgress);
  }
  requestAnimationFrame(tickProgress);

  // some quando carregar tudo
  window.addEventListener("load", () => {
    const elapsed = performance.now() - startedAt;
    const waitMore = Math.max(0, minShowMs - elapsed);

    setTimeout(() => {
      progress = 100;
      barFill.style.width = "100%";
      textEl.textContent = "pronto.";

      setTimeout(() => {
        overlay.classList.add("is-hidden");
        setTimeout(() => {
          clearInterval(phraseTimer);
          overlay.remove();
        }, 560);
      }, 260);
    }, waitMore);
  });
})();
const languageButton = document.getElementById("languageButton");
const languageMenu = document.getElementById("languageMenu");
const currentLanguage = document.getElementById("currentLanguage");

if (languageButton && languageMenu) {
  languageButton.addEventListener("click", () => {
    languageMenu.classList.toggle("open");
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLang = button.getAttribute("data-lang");

      currentLanguage.textContent = selectedLang === "pt" ? "Português" : "English";
      languageMenu.classList.remove("open");

      // aqui depois entra a tradução real dos textos
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".language-switcher")) {
      languageMenu.classList.remove("open");
    }
  });
}
const translations = {
  pt: {
    navAbout: "Sobre Mim",
    navWork: "Trabalho",
    navContact: "Contato",
    heroSubtitle: "Design Gráfico | Marketing Digital | Edição de Vídeo",
    heroDrag: "Arraste para girar o cubo",
    aboutTitle: "Sobre mim",
    workTitle: "Trabalho",
    videoEditing: "Edição de Vídeo",
    videoProjects: "Projetos em vídeo",
    videoDescription: "Projetos de edição de vídeos para Shorts, Reels, Tiktok e YouTube.",
    watchVideos: "Conferir vídeos",
    contactTitle: "Contato"
  },
  en: {
    navAbout: "About Me",
    navWork: "Work",
    navContact: "Contact",
    heroSubtitle: "Graphic Design | Digital Marketing | Video Editing",
    heroDrag: "Drag to rotate the cube",
    aboutTitle: "About me",
    workTitle: "Work",
    videoEditing: "Video Editing",
    videoProjects: "Video projects",
    videoDescription: "Video editing projects for Shorts, Reels, TikTok and YouTube.",
    watchVideos: "Watch videos",
    contactTitle: "Contact"
  }
};

const languageButton = document.getElementById("languageButton");
const languageMenu = document.getElementById("languageMenu");
const currentLanguage = document.getElementById("currentLanguage");

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");

    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  currentLanguage.textContent = lang === "pt" ? "Português" : "English";
  localStorage.setItem("siteLanguage", lang);
}

if (languageButton && languageMenu) {
  languageButton.addEventListener("click", () => {
    languageMenu.classList.toggle("open");
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLang = button.getAttribute("data-lang");
      setLanguage(selectedLang);
      languageMenu.classList.remove("open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".language-switcher")) {
      languageMenu.classList.remove("open");
    }
  });

  const savedLanguage = localStorage.getItem("siteLanguage") || "pt";
  setLanguage(savedLanguage);
}
