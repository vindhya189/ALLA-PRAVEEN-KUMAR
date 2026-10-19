/* ==========================================
   ABDUL KALAM SEVA SANGAM
   Complete JavaScript + Dark/Light Mode
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  // ==========================================
  // 1. THEME SWITCH: DARK / LIGHT MODE
  // ==========================================

  const themeToggle = $("#themeToggle");
  const themeIcon = themeToggle ? $("i", themeToggle) : null;
  const themeLabel = themeToggle ? $("span", themeToggle) : null;

  function applyTheme(theme) {
    const isLight = theme === "light";
    const currentTheme = isLight ? "light" : "dark";

    document.body.dataset.theme = currentTheme;
    document.documentElement.dataset.theme = currentTheme;
    document.documentElement.style.colorScheme = currentTheme;

    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );
      themeToggle.setAttribute(
        "title",
        isLight ? "Switch to dark mode" : "Switch to light mode"
      );
    }

    if (themeIcon) {
      themeIcon.className = isLight
        ? "fa-solid fa-moon"
        : "fa-solid fa-sun";
    }

    if (themeLabel) {
      const language =
        document.documentElement.lang === "en" ? "en" : "te";

      themeLabel.textContent = isLight
        ? language === "en"
          ? "Dark mode"
          : "డార్క్ మోడ్"
        : language === "en"
        ? "Light mode"
        : "లైట్ మోడ్";

      themeLabel.dataset.te = isLight
        ? "డార్క్ మోడ్"
        : "లైట్ మోడ్";

      themeLabel.dataset.en = isLight
        ? "Dark mode"
        : "Light mode";
    }

    try {
      localStorage.setItem("siteTheme", currentTheme);
    } catch (error) {
      // Theme still works if browser storage is unavailable.
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("siteTheme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.dataset.theme;

      applyTheme(currentTheme === "light" ? "dark" : "light");
    });
  }

  // ==========================================
  // 2. ENTER WEBSITE / FOUNDER INTRO
  // ==========================================

  const founderIntro = $("#founderIntro");
  const enterButton = $("#founderIntroSkip");
  const loader = $("#loader");

  let introFinished = false;

  function enterWebsite() {
    if (introFinished) return;

    introFinished = true;

    if (founderIntro) {
      founderIntro.classList.add("hidden");
      founderIntro.setAttribute("aria-hidden", "true");
    }

    document.body.classList.remove("intro-open");

    if (loader) {
      loader.classList.add("loaded");
    }

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  if (founderIntro) {
    document.body.classList.add("intro-open");
    founderIntro.setAttribute("aria-hidden", "false");
  }

  if (enterButton) {
    enterButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      enterWebsite();
    });
  }

  const introTimer = window.setTimeout(enterWebsite, 6500);

  if (enterButton) {
    enterButton.addEventListener(
      "click",
      function () {
        window.clearTimeout(introTimer);
      },
      { once: true }
    );

    enterButton.setAttribute("aria-label", "Enter website");
  }

  // ==========================================
  // 3. LOADING SCREEN
  // ==========================================

  function hideLoader() {
    if (loader) {
      loader.classList.add("loaded");
    }
  }

  window.addEventListener("load", hideLoader);

  window.setTimeout(hideLoader, 5000);

  // ==========================================
  // 4. CURRENT YEAR
  // ==========================================

  const currentYear = $("#currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 5. MOBILE NAVIGATION
  // ==========================================

  const menuButton = $("#menuBtn");
  const navLinks = $("#navLinks");

  function closeMobileMenu() {
    if (!menuButton || !navLinks) return;

    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  if (menuButton && navLinks) {
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));

      menuButton.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    $$("#navLinks a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", function (event) {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  // ==========================================
  // 6. SMOOTH SCROLL FOR ALL SECTION LINKS
  // ==========================================

  function scrollToSection(target) {
    if (!target) return;

    const navbar = $("#navbar");

    const navbarHeight = navbar
      ? navbar.getBoundingClientRect().height
      : 0;

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight -
      12;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });
  }

  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);

      if (!target) return;

      event.preventDefault();

      enterWebsite();
      closeMobileMenu();

      scrollToSection(target);

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });

  // ==========================================
  // 7. LANGUAGE SWITCH: TELUGU / ENGLISH
  // ==========================================

  const languageButtons = $$("[data-lang]");

  function setLanguage(language) {
    $$("[data-te][data-en]").forEach(function (element) {
      const translation = element.dataset[language];

      if (translation !== undefined) {
        element.textContent = translation;
      }
    });

    languageButtons.forEach(function (button) {
      const isActive = button.dataset.lang === language;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.documentElement.lang = language === "te" ? "te" : "en";

    // Update theme button text in the selected language.
    if (themeLabel) {
      const isLight =
        document.documentElement.dataset.theme === "light";

      themeLabel.textContent = isLight
        ? language === "en"
          ? "Dark mode"
          : "డార్క్ మోడ్"
        : language === "en"
        ? "Light mode"
        : "లైట్ మోడ్";

      themeLabel.dataset.te = isLight
        ? "డార్క్ మోడ్"
        : "లైట్ మోడ్";

      themeLabel.dataset.en = isLight
        ? "Dark mode"
        : "Light mode";
    }

    try {
      localStorage.setItem("siteLanguage", language);
    } catch (error) {
      // The website continues to work without local storage.
    }
  }

  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.dataset.lang);
    });
  });

  let savedLanguage = "te";

  try {
    savedLanguage = localStorage.getItem("siteLanguage") || "te";
  } catch (error) {
    savedLanguage = "te";
  }

  setLanguage(savedLanguage);

  // ==========================================
  // 8. GALLERY FILTERS
  // ==========================================

  const galleryFilterButtons = $$(".gfilter");
  const galleryCards = $$(".gallery-card");

  galleryFilterButtons.forEach(function (button) {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );

    button.addEventListener("click", function () {
      const category = button.dataset.filter;

      galleryFilterButtons.forEach(function (filter) {
        filter.classList.remove("active");
        filter.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      galleryCards.forEach(function (card) {
        const matches =
          category === "all" || card.dataset.cat === category;

        card.hidden = !matches;
      });
    });
  });

  // ==========================================
  // 9. FULL-SCREEN PHOTO LIGHTBOX
  // ==========================================

  const lightbox = $("#photoLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxCounter = $("#lightboxCounter");

  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  const photoButtons = $$(".gallery-image-button");

  let visiblePhotos = [];
  let currentPhotoIndex = 0;
  let lastFocusedElement = null;

  function getVisiblePhotos() {
    return photoButtons.filter(function (button) {
      const card = button.closest(".gallery-card");

      return card && !card.hidden;
    });
  }

  function displayPhoto(index) {
    if (!visiblePhotos.length || !lightboxImage) return;

    currentPhotoIndex =
      (index + visiblePhotos.length) % visiblePhotos.length;

    const button = visiblePhotos[currentPhotoIndex];
    const image = $("img", button);

    if (!image) return;

    const fullImage =
      button.dataset.full || image.currentSrc || image.src;

    const title = $(".gallery-info h3", button.closest(".gallery-card"));

    const caption = title
      ? title.textContent.trim()
      : image.alt || "Gallery photo";

    lightboxImage.src = fullImage;
    lightboxImage.alt = image.alt || caption;

    if (lightboxCaption) {
      lightboxCaption.textContent = caption;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent =
        `${currentPhotoIndex + 1} / ${visiblePhotos.length}`;
    }

    if (lightboxPrev) {
      lightboxPrev.disabled = visiblePhotos.length < 2;
    }

    if (lightboxNext) {
      lightboxNext.disabled = visiblePhotos.length < 2;
    }
  }

  function openLightbox(button) {
    if (!lightbox) return;

    visiblePhotos = getVisiblePhotos();

    const index = visiblePhotos.indexOf(button);

    if (index < 0) return;

    lastFocusedElement = document.activeElement;

    displayPhoto(index);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
    }

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {
      lastFocusedElement.focus();
    }
  }

  photoButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openLightbox(button);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      displayPhoto(currentPhotoIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      displayPhoto(currentPhotoIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (lightbox && lightbox.classList.contains("open")) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        displayPhoto(currentPhotoIndex - 1);
      }

      if (event.key === "ArrowRight") {
        displayPhoto(currentPhotoIndex + 1);
      }
    } else if (
      event.key === "Escape" &&
      navLinks &&
      navLinks.classList.contains("open")
    ) {
      closeMobileMenu();
    }
  });

  // ==========================================
  // 10. NAVBAR SCROLL EFFECT
  // ==========================================

  const navbar = $("#navbar");

  function updateNavbar() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }

  // ==========================================
  // 11. SCROLL PROGRESS BAR
  // ==========================================

  const progressBar = $("#progress");

  function updateScrollEffects() {
    updateNavbar();

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    const backToTop = $("#backToTop");

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 350);
    }
  }

  window.addEventListener("scroll", updateScrollEffects, {
    passive: true
  });

  window.addEventListener("resize", updateScrollEffects);

  updateScrollEffects();

  // ==========================================
  // 12. BACK TO TOP
  // ==========================================

  const backToTop = $("#backToTop");

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ==========================================
  // 13. ACTIVE NAVIGATION LINK
  // ==========================================

  const sections = $$("main section[id]");
  const navigationLinks = $$("#navLinks a[href^='#']");

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach(function (link) {
            const active =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", active);
          });
        });
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  
  // ==========================================
  // 14. CONTACT FORM - WHATSAPP INTEGRATION
  // ==========================================

  const contactForm = document.querySelector("#contactForm");
  const formStatus = document.querySelector("#contactFormStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = document.querySelector("#visitorName")?.value.trim();
      const email = document.querySelector("#visitorEmail")?.value.trim();
      const message = document.querySelector("#visitorMessage")?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = "దయచేసి అన్ని వివరాలు నమోదు చేయండి.";
        }
        return;
      }

      // Your WhatsApp number with India country code
      const whatsappNumber = "918121521566";

      // Prepare the visitor's message
      const whatsappMessage =
        "New Contact Form Message - Abdul Kalam Seva Sangam\n\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Message: " + message;

      const whatsappURL =
        "https://wa.me/" + whatsappNumber +
        "?text=" + encodeURIComponent(whatsappMessage);

      if (formStatus) {
        formStatus.textContent =
          "WhatsApp తెరుచుకుంటోంది. సందేశాన్ని పంపడానికి Send నొక్కండి.";
      }

      // Open WhatsApp with the pre-filled message
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback if the browser blocks the new window
      if (!whatsappWindow) {
        window.location.href = whatsappURL;
      }
    });
  }


  // ==========================================
  // 15. CUSTOM CURSOR EFFECT
  // ==========================================

  const cursor = $("#cursor");
  const cursorGlow = $("#cursorGlow");

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", function (event) {
      const x = `${event.clientX}px`;
      const y = `${event.clientY}px`;

      if (cursor) {
        cursor.style.left = x;
        cursor.style.top = y;
      }

      if (cursorGlow) {
        cursorGlow.style.left = x;
        cursorGlow.style.top = y;
      }
    });
  }

  // ==========================================
  // 16. IMAGE ERROR HANDLING
  // ==========================================

  $$("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.classList.add("image-error");
      image.dataset.imageError = "true";
    });
  });

  console.log("Abdul Kalam Seva Sangam website initialized.");
});