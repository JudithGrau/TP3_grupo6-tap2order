/* ==========================================================================
   Tap2Order · Landing page Grupo 06 (IFTS 29) · Etapa 1
   - Resaltado activo del menú con IntersectionObserver
   - Respaldo automático del logotipo
   - Botones globales "Expandir todo" / "Contraer todo" para <details>
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- 1. Navegación: enlace activo según la sección visible ---------- */
  function initActiveNav() {
    const links = Array.from(document.querySelectorAll(".main-nav .nav-link"));
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const setActive = (id) => {
      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    // Una sección se considera activa cuando cruza la franja central de la ventana
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- 2. Logotipo: respaldo si el archivo falta o no carga ---------- */
  function initLogoFallback() {
    const img = document.getElementById("logo-oficial");
    if (!img) return;
    const card = img.closest(".logo-card");

    const useFallback = () => {
      card.classList.add("is-fallback");
      // El respaldo pasa a ser el contenido accesible de la tarjeta
      const fallback = card.querySelector(".logo-fallback");
      fallback.removeAttribute("aria-hidden");
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", "Tap2Order (logotipo de respaldo)");
    };

    // El error puede haber ocurrido antes de que corra este script (defer)
    if (img.complete && img.naturalWidth === 0) {
      useFallback();
    } else {
      img.addEventListener("error", useFallback, { once: true });
    }
  }

  /* ---------- 3. Detalles: Expandir todo / Contraer todo ---------- */
  function initDetailsControls() {
    const section = document.getElementById("detalles");
    if (!section) return;

    const panels = section.querySelectorAll("details.panel");
    const status = document.getElementById("details-status");

    section.querySelectorAll("[data-details-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const expand = button.dataset.detailsAction === "expand";
        panels.forEach((panel) => { panel.open = expand; });
        if (status) {
          status.textContent = expand
            ? "Todos los paneles están expandidos."
            : "Todos los paneles están contraídos.";
        }
      });
    });
    // Nota: cada <summary> es nativo, por lo que ya funciona con clic, Tab, Enter y Espacio.
  }

  initActiveNav();
  initLogoFallback();
  initDetailsControls();
})();
