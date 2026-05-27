(function () {
  const SITE_VERSION = "v104";
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
  const heroVideo = document.querySelector(".hero-preview-visual__video");
  if (heroVideo) {
    if (reduced) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    } else {
      heroVideo.play().catch(function () {});
    }
  }
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
      '<a class="header-user" href="/001/library.html" aria-label="Open your library">' +
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
        window.location.href = "/001/library.html";
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

  function getThumbContext(thumb) {
    var card = thumb.closest(".guide-card");
    if (card) {
      var continueBtn = card.querySelector(".guide-card__actions .btn--primary");
      var titleEl = card.querySelector(".guide-card__title");
      var title = titleEl ? titleEl.textContent.trim() : "";
      return {
        href: continueBtn ? continueBtn.getAttribute("href") : null,
        label: title ? "Open Free Preview: " + title : "Open Free Preview",
      };
    }

    if (thumb.classList.contains("pdf-thumb--peek")) {
      return {
        href: "/001/reader.html?guide=micro-saas",
        label: "Open Free Preview: 50 AI Micro-SaaS Ideas You Can Build With LLMs",
      };
    }

    var titleWrap = thumb.closest(".title-with-thumb");
    if (titleWrap) {
      var heading = titleWrap.querySelector(".section__title");
      var coverTitle = heading ? heading.textContent.trim() : "cover";
      return { href: null, label: "View cover: " + coverTitle };
    }

    return { href: null, label: "View cover" };
  }

  function wireThumbPop(wrap, trigger, pop, frame) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var popHome = wrap;
    var bridgeTimer = null;
    var reparentTimer = null;
    var open = false;
    var popDurationMs = 650;

    function closeOtherPops() {
      document.querySelectorAll(".pdf-thumb__pop.is-open").forEach(function (other) {
        if (other === pop) return;
        other.classList.remove("is-open");
        var otherWrap = document.querySelector(
          '.pdf-thumb[data-pop-id="' + other.dataset.popId + '"]'
        );
        if (otherWrap) {
          otherWrap.classList.remove("is-pop-open");
          otherWrap.appendChild(other);
        }
      });
    }

    function openPop() {
      window.clearTimeout(bridgeTimer);
      window.clearTimeout(reparentTimer);
      if (open) return;

      closeOtherPops();
      open = true;
      pop.classList.remove("is-open");
      document.body.appendChild(pop);
      wrap.classList.add("is-pop-open");

      void pop.offsetWidth;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          pop.classList.add("is-open");
        });
      });
    }

    function closePop() {
      window.clearTimeout(bridgeTimer);
      if (!open) return;

      open = false;
      pop.classList.remove("is-open");
      wrap.classList.remove("is-pop-open");

      window.clearTimeout(reparentTimer);
      reparentTimer = window.setTimeout(function () {
        if (!pop.classList.contains("is-open")) {
          popHome.appendChild(pop);
        }
      }, popDurationMs);
    }

    function isOnFrame(node) {
      return node && (node === frame || frame.contains(node));
    }

    trigger.addEventListener("mouseenter", openPop);

    trigger.addEventListener("mouseleave", function (event) {
      if (isOnFrame(event.relatedTarget)) return;
      bridgeTimer = window.setTimeout(closePop, 180);
    });

    frame.addEventListener("mouseenter", function () {
      window.clearTimeout(bridgeTimer);
    });

    frame.addEventListener("mouseleave", function (event) {
      if (trigger.contains(event.relatedTarget)) {
        bridgeTimer = window.setTimeout(closePop, 180);
        return;
      }
      closePop();
    });
  }

  function coverPopUrl(thumbSrc) {
    if (!thumbSrc) return thumbSrc;
    if (thumbSrc.indexOf("-thumb.png") !== -1) {
      return thumbSrc.replace("-thumb.png", "-cover.png");
    }
    return thumbSrc;
  }

  function enhancePdfThumb(thumb) {
    if (thumb.dataset.thumbReady) return;

    var img = thumb.querySelector(":scope > img");
    if (!img) return;

    var ctx = getThumbContext(thumb);
    var thumbSrc = img.getAttribute("src") || img.src;
    var popSrc = img.getAttribute("data-pop-src") || coverPopUrl(thumbSrc);
    var popId = "pop-" + Math.random().toString(36).slice(2, 10);

    var wrap = document.createElement("div");
    wrap.className = thumb.className;
    wrap.dataset.thumbReady = "1";
    wrap.dataset.popId = popId;

    var trigger = document.createElement(ctx.href ? "a" : "span");
    trigger.className = "pdf-thumb__trigger";
    if (ctx.href) {
      trigger.href = ctx.href;
    }
    trigger.setAttribute("aria-label", ctx.label);
    trigger.innerHTML = img.outerHTML;

    var pop = document.createElement("span");
    pop.className = "pdf-thumb__pop";
    pop.dataset.popId = popId;
    pop.setAttribute("aria-hidden", "true");
    pop.innerHTML =
      '<span class="pdf-thumb__pop-frame">' +
      '<img src="' +
      popSrc +
      '" alt="" width="1275" height="1650" decoding="async" />' +
      "</span>";

    pop.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
    });

    var frame = pop.querySelector(".pdf-thumb__pop-frame");
    wireThumbPop(wrap, trigger, pop, frame);

    wrap.appendChild(trigger);
    wrap.appendChild(pop);
    thumb.replaceWith(wrap);
  }

  function initPdfThumbs() {
    document
      .querySelectorAll(".pdf-thumb:not([data-thumb-ready]), .guide-card__cover:not([data-thumb-ready])")
      .forEach(enhancePdfThumb);
  }

  function initSite() {
    initAuthHeader();
    initPdfThumbs();

    var thumbObserver = new MutationObserver(function () {
      initPdfThumbs();
    });
    thumbObserver.observe(document.body, { childList: true, subtree: true });
  }

  window.LivingPDFs = window.LivingPDFs || {};
  window.LivingPDFs.initPdfThumbs = initPdfThumbs;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite);
  } else {
    initSite();
  }
})();

