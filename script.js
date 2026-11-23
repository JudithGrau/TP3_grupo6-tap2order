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

  /* ---------- 4. Diagramas: Simulación interactiva de caminos Sí y No (Etapa 3) ---------- */
  function initDiagramSimulations() {
    const diagrams = ["r3", "r4"];

    // Configuración de secuencias y textos para cada diagrama
    const simConfig = {
      r3: {
        title: "Diagrama R3",
        yesSteps: [
          { node: "r3-in", desc: "Paso 1: Pedido en edición (versión N) con confirmación del pasajero." },
          { path: "r3-path-1" },
          { node: "r3-c1", desc: "Paso 2: ¿El pedido está completo y conserva productos disponibles? -> Sí." },
          { path: "r3-path-c1-yes" },
          { node: "r3-act", desc: "Paso 3: Acción -> Estado pasa a 'envío pendiente'; se envía versión N a cocina." },
          { path: "r3-path-2" },
          { node: "r3-c2", desc: "Paso 4: ¿Cocina confirma recepción de la versión N? -> Sí." },
          { path: "r3-path-c2-yes" },
          { node: "r3-res", desc: "Paso 5: Resultado -> Se registra 'recibido por cocina' (versión N)." }
        ],
        yesSummary: "Simulación camino Sí (R3): El pedido está completo y con productos disponibles; avanza a 'envío pendiente' y, tras confirmación de cocina de la versión N, se registra 'recibido por cocina'.",
        noSteps: [
          { node: "r3-in", desc: "Paso 1: Pedido en edición (versión N) con confirmación del pasajero." },
          { path: "r3-path-1" },
          { node: "r3-c1", desc: "Paso 2: Evaluación en Condición 1 (completitud y stock)." },
          { path: "r3-path-c1-no" },
          { node: "r3-c1-no", desc: "Desvío 1: No cumple -> Permanece 'en edición' y se indican datos o stock faltantes." },
          { node: "r3-c2", desc: "Evaluación en Condición 2 (confirmación de recepción)." },
          { path: "r3-path-c2-no" },
          { node: "r3-c2-no", desc: "Desvío 2: Cocina no confirma -> Sigue en 'envío pendiente'; reintento y alerta al personal." }
        ],
        noSummary: "Simulación camino No (R3): Si el pedido está incompleto o falta stock, permanece en edición. Si cocina no confirma recepción, continúa en envío pendiente con reintentos y alerta al personal."
      },
      r4: {
        title: "Diagrama R4",
        yesSteps: [
          { node: "r4-in", desc: "Paso 1: Entrada -> Aviso 'listo' + versión informada + estado de modificaciones pendientes." },
          { path: "r4-path-1" },
          { node: "r4-c1", desc: "Paso 2: ¿El aviso proviene de cocina? -> Sí." },
          { path: "r4-path-c1-yes" },
          { node: "r4-c2", desc: "Paso 3: ¿Es la versión vigente y sin modificaciones pendientes? -> Sí." },
          { path: "r4-path-c2-yes" },
          { node: "r4-act", desc: "Paso 4: Acción -> El sistema cambia el estado a 'listo'." },
          { path: "r4-path-2" },
          { node: "r4-res", desc: "Paso 5: Resultado -> Se notifica a pasajero y personal para entrega en camarote o comedor." }
        ],
        yesSummary: "Simulación camino Sí (R4): El aviso proviene de cocina sobre la versión vigente y sin modificaciones pendientes; el sistema cambia el estado a 'listo' y notifica para entrega.",
        noSteps: [
          { node: "r4-in", desc: "Paso 1: Entrada -> Aviso 'listo' + versión informada." },
          { path: "r4-path-1" },
          { node: "r4-c1", desc: "Paso 2: Evaluación en Condición 1 (origen del aviso)." },
          { path: "r4-path-c1-no" },
          { node: "r4-c1-no", desc: "Desvío 1: No proviene de cocina -> Sin cambio de estado; el pasajero por sí solo no puede marcar 'listo'." },
          { node: "r4-c2", desc: "Evaluación en Condición 2 (versión vigente y modificaciones)." },
          { path: "r4-path-c2-no" },
          { node: "r4-c2-no", desc: "Desvío 2: Modificación pendiente o desactualizado -> Se mantiene el estado; cocina debe procesar la versión actualizada." }
        ],
        noSummary: "Simulación camino No (R4): Si el aviso no proviene de cocina, no hay cambio de estado. Si existen modificaciones pendientes o no es la versión vigente, se mantiene el estado sin avanzar."
      }
    };

    diagrams.forEach((diagKey) => {
      const card = document.getElementById(`diagrama-${diagKey}`);
      if (!card) return;

      const liveRegion = document.getElementById(`${diagKey}-live`);
      const statusBar = document.getElementById(`${diagKey}-status-bar`);
      const statusMsg = statusBar ? statusBar.querySelector(".status-msg") : null;
      const statusDot = statusBar ? statusBar.querySelector(".status-dot") : null;

      const btnYes = card.querySelector(`[data-sim="yes"]`);
      const btnNo = card.querySelector(`[data-sim="no"]`);
      const btnReset = card.querySelector(`[data-sim="reset"]`);
      const allButtons = [btnYes, btnNo, btnReset].filter(Boolean);

      let activeTimers = [];

      // Limpia clases de resaltado y temporizadores pendientes
      const clearHighlights = () => {
        activeTimers.forEach((t) => clearTimeout(t));
        activeTimers = [];
        card.querySelectorAll(".is-active-step, .is-active-path").forEach((el) => {
          el.classList.remove("is-active-step", "is-active-path");
        });
      };

      // Manejo estricto de aria-pressed en el toolbar
      const setPressedState = (activeBtn) => {
        allButtons.forEach((btn) => {
          const isPressed = btn === activeBtn;
          btn.setAttribute("aria-pressed", isPressed ? "true" : "false");
          btn.classList.toggle("is-pressed", isPressed);
        });
      };

      // Reinicio: limpia clases, restaura botones y vacía la región aria-live
      const resetSimulation = () => {
        clearHighlights();
        allButtons.forEach((btn) => {
          btn.setAttribute("aria-pressed", "false");
          btn.classList.remove("is-pressed");
        });
        if (liveRegion) {
          liveRegion.textContent = "";
        }
        if (statusMsg) {
          statusMsg.textContent = "Selecciona una simulación para recorrer los pasos.";
        }
        if (statusDot) {
          statusDot.className = "status-dot";
        }
      };

      // Ejecución de la simulación (Sí o No)
      const runSimulation = (mode) => {
        clearHighlights();
        const activeBtn = mode === "yes" ? btnYes : btnNo;
        setPressedState(activeBtn);

        const config = simConfig[diagKey];
        const steps = mode === "yes" ? config.yesSteps : config.noSteps;
        const summary = mode === "yes" ? config.yesSummary : config.noSummary;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (statusDot) {
          statusDot.className = `status-dot status-${mode}`;
        }

        // Si el usuario prefiere movimiento reducido, aplica todo de inmediato sin animación
        if (prefersReducedMotion) {
          steps.forEach((step) => {
            if (step.node) {
              const nodeEl = card.querySelector(`[data-node="${step.node}"]`);
              if (nodeEl) nodeEl.classList.add("is-active-step");
            }
            if (step.path) {
              const pathEl = card.querySelector(`[data-path="${step.path}"]`);
              if (pathEl) pathEl.classList.add("is-active-path");
            }
          });
          if (statusMsg) statusMsg.textContent = summary;
          if (liveRegion) liveRegion.textContent = summary;
          return;
        }

        // Resaltado visual progresivo con temporizador secuencial
        const stepDelay = 280;
        steps.forEach((step, index) => {
          const timer = setTimeout(() => {
            if (step.node) {
              const nodeEl = card.querySelector(`[data-node="${step.node}"]`);
              if (nodeEl) nodeEl.classList.add("is-active-step");
            }
            if (step.path) {
              const pathEl = card.querySelector(`[data-path="${step.path}"]`);
              if (pathEl) pathEl.classList.add("is-active-path");
            }
            if (step.desc && statusMsg) {
              statusMsg.textContent = step.desc;
            }
            // Al finalizar el último paso, anuncia el resumen completo en aria-live
            if (index === steps.length - 1) {
              if (statusMsg) statusMsg.textContent = summary;
              if (liveRegion) liveRegion.textContent = summary;
            }
          }, index * stepDelay);
          activeTimers.push(timer);
        });
      };

      if (btnYes) btnYes.addEventListener("click", () => runSimulation("yes"));
      if (btnNo) btnNo.addEventListener("click", () => runSimulation("no"));
      if (btnReset) btnReset.addEventListener("click", resetSimulation);
    });
  }

  initActiveNav();
  initLogoFallback();
  initDetailsControls();
  initDiagramSimulations();
})();
