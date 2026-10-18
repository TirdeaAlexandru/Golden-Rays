(function () {
  const languageSelect = document.querySelector("#language-select");
  const pageTitles = {
    "index.html": ["Golden Rays — Photography Club", "Golden Rays — Club de fotografie"],
    "about.html": ["The club — Golden Rays", "Clubul — Golden Rays"],
    "activities.html": ["What we do — Golden Rays", "Ce facem — Golden Rays"],
    "gallery.html": ["Gallery — Golden Rays", "Galerie — Golden Rays"],
    "awards.html": ["Recognition — Golden Rays", "Premii — Golden Rays"],
    "contact.html": ["Join us — Golden Rays", "Alătură-te — Golden Rays"]
  };
  function setLanguage(language) {
    const lang = language === "ro" ? "ro" : "en";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-en][data-ro]").forEach(function (element) {
      if (element instanceof HTMLMetaElement && element.name === "description") {
        element.content = element.dataset[lang];
      } else {
        element.innerHTML = element.dataset[lang];
      }
    });
    const title = pageTitles[location.pathname.split("/").pop() || "index.html"];
    if (title) document.title = title[lang === "ro" ? 1 : 0];
    if (languageSelect) languageSelect.value = lang;
    try { localStorage.setItem("golden-rays-language-v2", lang); } catch (_) {}
  }
  if (languageSelect) {
    let savedLanguage = "ro";
    try { savedLanguage = localStorage.getItem("golden-rays-language-v2") || "ro"; } catch (_) {}
    setLanguage(savedLanguage);
    languageSelect.addEventListener("change", function () { setLanguage(languageSelect.value); });
  }

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (year) {
    year.textContent = new Date().getFullYear();
  });

  const cookieNotice = document.createElement("aside");
  cookieNotice.className = "cookie-notice";
  cookieNotice.setAttribute("aria-label", "Cookie and privacy notice");
  cookieNotice.innerHTML = '<p data-en="We don’t use tracking cookies. Your language choice is saved in this browser." data-ro="Nu folosim cookie-uri de urmărire. Limba aleasă este salvată în acest browser.">Nu folosim cookie-uri de urmărire. Limba aleasă este salvată în acest browser.</p><button type="button" data-en="Got it" data-ro="Am înțeles">Am înțeles</button>';
  cookieNotice.querySelectorAll("[data-en][data-ro]").forEach(function (element) {
    element.innerHTML = element.dataset[document.documentElement.lang === "en" ? "en" : "ro"];
  });
  let noticeDismissed = false;
  try { noticeDismissed = localStorage.getItem("golden-rays-cookie-note-v1") === "dismissed"; } catch (_) {}
  if (!noticeDismissed) document.body.appendChild(cookieNotice);
  cookieNotice.querySelector("button").addEventListener("click", function () {
    cookieNotice.remove();
    try { localStorage.setItem("golden-rays-cookie-note-v1", "dismissed"); } catch (_) {}
  });

  const links = Array.from(document.querySelectorAll(".photo-grid a[data-full]"));
  if (!links.length) return;
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Photograph viewer");
  lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close viewer">×</button><button type="button" class="lightbox-prev" aria-label="Previous photograph">‹</button><img alt=""><button type="button" class="lightbox-next" aria-label="Next photograph">›</button>';
  document.body.appendChild(lightbox);
  const image = lightbox.querySelector("img");
  let index = 0;
  let previousFocus = null;
  let touchStartX = null;
  function show(next) {
    index = (next + links.length) % links.length;
    image.src = links[index].dataset.full;
    image.alt = links[index].querySelector("img").alt;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
  }
  function close() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    if (previousFocus) previousFocus.focus();
  }
  links.forEach(function (link, i) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      previousFocus = link;
      show(i);
      lightbox.querySelector(".lightbox-close").focus();
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { show(index - 1); });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () { show(index + 1); });
  lightbox.addEventListener("click", function (event) { if (event.target === lightbox) close(); });
  lightbox.addEventListener("touchstart", function (event) {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", function (event) {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) show(index + (distance < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
}());
