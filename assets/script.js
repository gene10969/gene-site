// ナビ開閉
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  const nav = document.getElementById('nav');
  nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
});

// ローディング（トップページのみ）
window.addEventListener('load', () => {
  const circle = document.getElementById('loading-circle');
  const logo = document.getElementById('loading-logo');

  if (circle && logo) {// ▼ ナビ開閉
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");

  if (toggle) {
    toggle.addEventListener("click", () => {
      nav.style.display = nav.style.display === "block" ? "none" : "block";
    });
  }
});

// ▼ トップページ専用ローディング
window.addEventListener("load", () => {
  const circle = document.getElementById("loading-circle");
  const logo = document.getElementById("loading-logo");

  if (circle && logo) {
    setTimeout(() => {
      circle.classList.add("hide");
      logo.classList.add("show");
    }, 600);

    setTimeout(() => {
      logo.classList.add("fadeout");
    }, 1400);

    setTimeout(() => {
      circle.remove();
      logo.remove();
    }, 2400);
  }
});

      circle.classList.add('hide');
      logo.classList.add('show');
    }, 600);

    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 1400);
  }
});
