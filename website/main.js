/* Vectron Orbit - official website. (c) 2026 GhostKrisssDEV. All rights reserved. */
(function () {
  "use strict";

  // ---------- animated star field (behind everything) ----------
  const canvas = document.getElementById("stars");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w = 0, h = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      const count = Math.min(420, Math.floor((innerWidth * innerHeight) / 4200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random() * 0.9 + 0.1, t: Math.random() * 6.28,
      }));
    }
    let scrollY = 0;
    addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
    function frame() {
      ctx.fillStyle = "#03050c";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.t += 0.02;
        const y = (s.y - scrollY * s.z * 0.6) % h;
        const yy = y < 0 ? y + h : y;
        const a = 0.35 + 0.65 * s.z * (0.75 + 0.25 * Math.sin(s.t));
        ctx.fillStyle = s.z > 0.8 ? `rgba(255,214,150,${a})` : `rgba(180,215,255,${a})`;
        const r = s.z * 1.6;
        ctx.fillRect(s.x, yy, r, r);
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    resize();
    addEventListener("resize", resize);
    frame();
  }

  // ---------- mobile menu ----------
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".nav ul");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));
  }

  // ---------- reveal on scroll ----------
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => io ? io.observe(el) : el.classList.add("in"));

  // ---------- screenshot lightbox ----------
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const img = lb.querySelector("img");
    document.querySelectorAll(".shot").forEach((s) => s.addEventListener("click", () => {
      img.src = s.dataset.full;
      img.alt = s.querySelector("img").alt;
      lb.classList.add("open");
    }));
    lb.addEventListener("click", () => lb.classList.remove("open"));
    addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  // ---------- light copy protection for artwork ----------
  document.addEventListener("contextmenu", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
  document.addEventListener("dragstart", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });

  // ---------- version + patch notes ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function entryHTML(n, full, latest) {
    const items = (n.items || []).slice(0, full ? 99 : 4).map((i) => `<li>${esc(i)}</li>`).join("");
    return `<article class="card update${full ? " entry" : ""}${latest ? " latest" : ""}">
      <div class="ver">v${esc(n.version)} · ${esc(n.date)}</div>
      <h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p><ul>${items}</ul></article>`;
  }
  fetch("patch-notes.json", { cache: "no-cache" }).then((r) => r.json()).then((notes) => {
    const latest = notes[0];
    document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = "v" + latest.version; });
    const home = document.getElementById("latest-updates");
    if (home) home.innerHTML = notes.slice(0, 2).map((n, i) => entryHTML(n, false, i === 0)).join("");
    const all = document.getElementById("all-notes");
    if (all) all.innerHTML = notes.map((n, i) => entryHTML(n, true, i === 0)).join("");
  }).catch(() => {});

  // ---------- footer year ----------
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
