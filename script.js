(() => {
  "use strict";

  const WHATSAPP_NUMBER = "923120301998";

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Announcement bar dismiss (remembered per browser)
  const announce = document.getElementById("announce");
  try {
    if (localStorage.getItem("ss-announce-dismissed") === "1") announce.classList.add("hidden");
  } catch (_) { /* storage unavailable */ }
  announce.querySelector(".announce-close").addEventListener("click", () => {
    announce.classList.add("hidden");
    try { localStorage.setItem("ss-announce-dismissed", "1"); } catch (_) { /* ignore */ }
  });

  // Header background on scroll
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Active nav link while scrolling
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));

    // Reveal on scroll
    const revealer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  // Service card links pre-select the service in the form
  const serviceSelect = document.getElementById("service");
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => { serviceSelect.value = link.dataset.service; });
  });

  // Contact form -> WhatsApp message
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    form.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
    const errors = [];
    if (name.length < 2) { errors.push("your name"); form.name.closest(".field").classList.add("invalid"); }
    if (!/^[+\d][\d\s-]{9,}$/.test(phone)) { errors.push("a valid phone number"); form.phone.closest(".field").classList.add("invalid"); }

    if (errors.length) {
      note.className = "form-note error";
      note.textContent = "Please enter " + errors.join(" and ") + ".";
      return;
    }

    const lines = [
      "Assalam o Alaikum Shape Shifters!",
      "",
      "Name: " + name,
      "Phone: " + phone,
      "Branch: " + data.get("branch"),
      "Interested in: " + data.get("service"),
    ];
    const message = String(data.get("message") || "").trim();
    if (message) lines.push("Message: " + message);

    const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");

    note.className = "form-note success";
    note.textContent = "Opening WhatsApp… If nothing happens, call us at 0312 0301998.";
    form.reset();
  });
})();
