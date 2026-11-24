const validRoutes = new Set(["alerts", "alert-detail", "rag", "governance"]);
const views = [...document.querySelectorAll("[data-view]")];
const navigationLinks = [...document.querySelectorAll("[data-route]")];
const toast = document.getElementById("toast");
let toastTimer;

function currentRoute() {
  const route = window.location.hash.replace("#", "");
  return validRoutes.has(route) ? route : "alerts";
}

function renderRoute() {
  const route = currentRoute();
  views.forEach((view) => {
    const active = view.dataset.view === route;
    view.hidden = !active;
    if (active) {
      const heading = view.querySelector("h1");
      requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
    }
  });

  navigationLinks.forEach((link) => {
    if (link.dataset.route === route) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
  document.title = `SDATR · ${navigationLinks.find((link) => link.dataset.route === route)?.textContent.trim() || "Prototipo"}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

window.addEventListener("hashchange", renderRoute);
if (!window.location.hash || !validRoutes.has(window.location.hash.slice(1))) {
  window.location.hash = "alerts";
} else {
  renderRoute();
}

// Cada preferencia se aplica en el elemento donde sus variables CSS pueden
// propagarse correctamente. El tamaño del texto debe cambiar desde <html>
// porque la interfaz utiliza unidades rem; densidad y contraste viven en body.
const preferenceButtons = [
  {
    buttonId: "density-toggle",
    className: "comfortable",
    target: document.body,
    activeLabel: "Vista compacta",
    inactiveLabel: "Vista cómoda",
  },
  {
    buttonId: "font-toggle",
    className: "large-text",
    target: document.documentElement,
    activeLabel: "Texto normal",
    inactiveLabel: "Texto grande",
  },
  {
    buttonId: "contrast-toggle",
    className: "high-contrast",
    target: document.body,
    activeLabel: "Contraste normal",
    inactiveLabel: "Alto contraste",
  },
];

preferenceButtons.forEach(({ buttonId, className, target, activeLabel, inactiveLabel }) => {
  const button = document.getElementById(buttonId);
  button.addEventListener("click", () => {
    const active = target.classList.toggle(className);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? activeLabel : inactiveLabel;
    showToast(active ? `${inactiveLabel} activado.` : `${activeLabel} restaurado.`);
  });
});

document.getElementById("why-order").addEventListener("click", () => {
  document.getElementById("order-explanation").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("order-title").focus?.();
});

document.getElementById("restore-order").addEventListener("click", () => {
  document.querySelector(".alert-row.is-priority")?.classList.remove("is-priority");
  showToast("Orden base restaurado. La sugerencia de IA permanece disponible para consulta.");
});

const filterForm = document.getElementById("alert-filters");
filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.getElementById("status-filter").value;
  const severity = document.getElementById("severity-filter").value;
  const search = document.getElementById("alert-search").value.trim().toLowerCase();
  let visible = 0;

  document.querySelectorAll(".alert-row").forEach((row) => {
    const matchesStatus = status === "all" || row.dataset.status === status;
    const matchesSeverity = severity === "all" || row.dataset.severity === severity;
    const matchesSearch = !search || row.dataset.search.toLowerCase().includes(search);
    row.hidden = !(matchesStatus && matchesSeverity && matchesSearch);
    if (!row.hidden) visible += 1;
  });

  document.getElementById("result-count").textContent = `${visible} ${visible === 1 ? "resultado" : "resultados"}`;
  showToast("Filtros aplicados sin perder el contexto de la bandeja.");
});

document.querySelectorAll(".select-alert").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Este prototipo desarrolla en detalle la alerta ALT-1048.");
  });
});

document.getElementById("toggle-technical").addEventListener("click", (event) => {
  const detail = document.getElementById("technical-detail");
  const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
  detail.hidden = expanded;
  event.currentTarget.setAttribute("aria-expanded", String(!expanded));
  event.currentTarget.textContent = expanded ? "Ver detalle técnico" : "Ocultar detalle técnico";
});

const evidenceDialog = document.getElementById("evidence-dialog");
const evidenceTitle = document.getElementById("evidence-dialog-title");
const evidenceContent = document.getElementById("evidence-content");

// Los cierres son botones normales y no envíos de formulario. Esto evita que
// la validación de campos obligatorios impida cancelar una decisión.
document.querySelectorAll("[data-dialog-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");
    if (dialog?.open) dialog.close("cancel");
  });
});

// El elemento <dialog> conserva el cierre nativo con Escape. Además, un clic
// directo sobre el fondo modal permite salir sin ejecutar ninguna acción.
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && dialog.open) dialog.close("cancel");
  });
});

const evidenceData = {
  events: ["18 eventos relacionados", "Ventana: 10:42:18–10:47:18. Acción: deny. Puerto destino: 22. Fuente: FortiGate-01."],
  event: ["Evento EVT-7F32A9", "10:42:18 · 10.0.1.24:55120 → 172.16.0.8:22 · TCP · deny · 1.240 bytes enviados."],
  alert: ["Alerta ALT-1048", "Estado: abierta. Severidad: crítica. Riesgo: 87/100. Responsable: Ana C. Clasificación: pendiente."],
  ip: ["Historial de 10.0.1.24", "18 denegaciones SSH y tres destinos observados durante la ventana. Sin confirmación automática de ataque."],
  port: ["Puerto 22 · SSH", "Servicio administrativo sensible. La presencia del puerto no es suficiente para determinar una amenaza."],
  rule: ["Regla R-SSH-005 v3", "Condición: denegaciones SSH repetidas. Umbral: 15 eventos. Ventana: 5 minutos. Estado: activa."],
};

document.querySelectorAll("[data-evidence]").forEach((button) => {
  button.addEventListener("click", () => {
    const [title, content] = evidenceData[button.dataset.evidence] || ["Evidencia", "Información demostrativa."];
    evidenceTitle.textContent = title;
    evidenceContent.innerHTML = `<p>${content}</p><p class="limit-note">Dato ficticio incluido únicamente para demostrar navegación y trazabilidad.</p>`;
    evidenceDialog.showModal();
  });
});

const actionDialog = document.getElementById("action-dialog");
const actionTitle = document.getElementById("action-dialog-title");
const actionReason = document.getElementById("action-reason");
const actionForm = document.getElementById("action-form");
let pendingAction = "";

document.querySelectorAll(".action-button").forEach((button) => {
  button.addEventListener("click", () => {
    pendingAction = button.dataset.action;
    actionTitle.textContent = pendingAction;
    actionReason.value = "";
    actionDialog.showModal();
  });
});

actionForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  if (!actionReason.value.trim()) {
    actionReason.focus();
    actionReason.setCustomValidity("Registre un motivo para conservar la trazabilidad.");
    actionReason.reportValidity();
    actionReason.setCustomValidity("");
    return;
  }

  const timeline = document.getElementById("audit-timeline");
  if (timeline) {
    const item = document.createElement("li");
    item.innerHTML = `<time>Ahora</time><div><strong>${pendingAction}</strong><span>Analista OP · motivo registrado · demostración local</span></div>`;
    timeline.append(item);
  }
  actionDialog.close();
  showToast(`${pendingAction}: acción demostrativa registrada. El resultado original se conserva.`);
});

const ragForm = document.getElementById("rag-form");
ragForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("rag-query").value.trim();
  const answer = document.getElementById("rag-answer-content");
  const status = document.getElementById("rag-status");
  status.textContent = "Recuperando fuentes demostrativas...";
  answer.setAttribute("aria-busy", "true");
  window.setTimeout(() => {
    if (!query) {
      answer.innerHTML = "<p><strong>Evidencia insuficiente:</strong> escriba una consulta para buscar fuentes autorizadas.</p>";
    } else {
      answer.innerHTML = `
        <p>Se detectaron <strong>18 intentos SSH denegados</strong> desde la IP <strong>10.0.1.24</strong> durante una ventana de cinco minutos.</p>
        <p>La regla <strong>R-SSH-005 v3</strong> coincidió y el comportamiento obtuvo un puntaje de anomalía de <strong>0,92</strong>. XGBoost lo clasificó como posible fuerza bruta con <strong>88 %</strong> de probabilidad.</p>
        <p>La evidencia apoya una revisión prioritaria; no confirma por sí sola un incidente.</p>`;
    }
    status.textContent = "3 fuentes · respuesta demostrativa";
    answer.setAttribute("aria-busy", "false");
    showToast("Respuesta reconstruida con tres fuentes ficticias y rutas trazables.");
  }, 550);
});

document.querySelectorAll(".feedback-button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.feedback}: retroalimentación registrada para revisión humana; no reentrena el modelo.`);
  });
});

