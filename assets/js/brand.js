(function () {
  const SITE_VERSION = "v52";
  const AUTH_KEY = "livingpdfs_demo_user";
  const DEMO_USER = {
    email: "bearllc555@gmail.com",
    name: "Anthony",
  };

  document.querySelectorAll("[data-version]").forEach((el) => {
    el.textContent = SITE_VERSION;
  });

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`[data-nav="${page}"]`).forEach((el) => {
      el.classList.add("is-active");
    });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length && !reduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  document.querySelectorAll(".book-row .book").forEach((book, i) => {
    book.style.transitionDelay = i * 0.06 + "s";
  });

  function getStoredUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function userInitial(user) {
    return (user.name || user.email || "?").charAt(0).toUpperCase();
  }

  function signOut() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "/";
  }

  function renderSignedInHeader(mount, user) {
    mount.innerHTML =
      '<div class="header-auth">' +
      '<a class="header-user" href="/library.html" aria-label="Open your library">' +
      '<span class="header-user__avatar" aria-hidden="true">' +
      userInitial(user) +
      "</span>" +
      '<span class="header-user__label">My library</span>' +
      "</a>" +
      '<button type="button" class="header-sign-out" data-sign-out>Sign out</button>' +
      "</div>";
    document.body.classList.add("is-signed-in");
  }

  function wireGoogleSignIn(mount) {
    const wrap = mount.querySelector("[data-auth-signin]");
    if (!wrap) return;

    const trigger = wrap.querySelector("[data-google-trigger]");
    const popdown = wrap.querySelector("[data-google-popdown]");
    const continueBtn = wrap.querySelector("[data-google-continue]");
    const cancelBtn = wrap.querySelector("[data-google-cancel]");
    if (!trigger || !popdown || !continueBtn || !cancelBtn) return;

    function openPopdown() {
      popdown.hidden = false;
      requestAnimationFrame(function () {
        popdown.classList.add("is-open");
      });
      trigger.setAttribute("aria-expanded", "true");
    }

    function closePopdown() {
      popdown.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      window.setTimeout(function () {
        if (!popdown.classList.contains("is-open")) {
          popdown.hidden = true;
        }
      }, 220);
    }

    trigger.addEventListener("click", function (event) {
      event.stopPropagation();
      if (popdown.classList.contains("is-open")) {
        closePopdown();
      } else {
        openPopdown();
      }
    });

    continueBtn.addEventListener("click", function () {
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER));
      closePopdown();
      renderSignedInHeader(mount, DEMO_USER);

      var path = window.location.pathname;
      var onLibrary = /library\.html$/i.test(path) || path.replace(/\/$/, "").endsWith("/library");
      if (!onLibrary) {
        window.location.href = "/library.html";
      }
    });

    cancelBtn.addEventListener("click", closePopdown);

    document.addEventListener("click", function (event) {
      if (!wrap.contains(event.target)) {
        closePopdown();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePopdown();
      }
    });
  }

  function initAuthHeader() {
    var mount = document.querySelector("[data-auth-root]");
    if (!mount) return;

    var user = getStoredUser();
    if (user) {
      renderSignedInHeader(mount, user);
    } else {
      wireGoogleSignIn(mount);
    }
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-sign-out]");
    if (!target) return;
    event.preventDefault();
    signOut();
  });

  var coverLightbox = null;
  var coverLightboxImg = null;
  var activeCoverThumb = null;

  function closeCoverLightbox() {
    if (!coverLightbox) return;
    coverLightbox.hidden = true;
    document.body.classList.remove("is-cover-open");
    if (activeCoverThumb) {
      activeCoverThumb.classList.remove("is-cover-open");
      activeCoverThumb.setAttribute("aria-expanded", "false");
      activeCoverThumb = null;
    }
  }

  function openCoverLightbox(thumb, src) {
    if (!coverLightbox || !coverLightboxImg) return;

    if (activeCoverThumb && activeCoverThumb !== thumb) {
      activeCoverThumb.classList.remove("is-cover-open");
      activeCoverThumb.setAttribute("aria-expanded", "false");
    }

    coverLightboxImg.src = src;
    coverLightbox.hidden = false;
    document.body.classList.add("is-cover-open");
    activeCoverThumb = thumb;
    thumb.classList.add("is-cover-open");
    thumb.setAttribute("aria-expanded", "true");
  }

  function initPdfThumbPopups() {
    coverLightbox = document.createElement("div");
    coverLightbox.className = "pdf-cover-lightbox";
    coverLightbox.hidden = true;
    coverLightbox.setAttribute("role", "dialog");
    coverLightbox.setAttribute("aria-modal", "true");
    coverLightbox.setAttribute("aria-label", "Cover preview");
    coverLightbox.innerHTML =
      '<button type="button" class="pdf-cover-lightbox__backdrop" aria-label="Close cover preview"></button>' +
      '<div class="pdf-cover-lightbox__frame">' +
      '<button type="button" class="pdf-cover-lightbox__close" aria-label="Close cover preview"><span aria-hidden="true">&times;</span></button>' +
      '<img src="" alt="" width="544" height="786" decoding="async" /></div>';
    document.body.appendChild(coverLightbox);

    coverLightboxImg = coverLightbox.querySelector(".pdf-cover-lightbox__frame img");
    var backdrop = coverLightbox.querySelector(".pdf-cover-lightbox__backdrop");
    var frame = coverLightbox.querySelector(".pdf-cover-lightbox__frame");
    var closeBtn = coverLightbox.querySelector(".pdf-cover-lightbox__close");

    backdrop.addEventListener("click", closeCoverLightbox);
    frame.addEventListener("click", closeCoverLightbox);
    closeBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      closeCoverLightbox();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && coverLightbox && !coverLightbox.hidden) {
        closeCoverLightbox();
      }
    });

    document.querySelectorAll(".pdf-thumb:not([data-pop-ready])").forEach(function (thumb) {
      thumb.dataset.popReady = "1";
      thumb.setAttribute("role", "button");
      thumb.setAttribute("aria-label", "View cover");
      thumb.setAttribute("aria-expanded", "false");

      var img = thumb.querySelector("img");
      if (!img) return;

      thumb.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        var src = img.currentSrc || img.src;
        if (activeCoverThumb === thumb && coverLightbox && !coverLightbox.hidden) {
          closeCoverLightbox();
        } else {
          openCoverLightbox(thumb, src);
        }
      });
    });
  }

  function initSite() {
    initAuthHeader();
    initPdfThumbPopups();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite);
  } else {
    initSite();
  }
})();
