(function () {
  const SITE_VERSION = "v01";

  document.querySelectorAll("[data-version]").forEach((el) => {
    el.textContent = SITE_VERSION;
  });

  window.SITE_VERSION = SITE_VERSION;
})();
