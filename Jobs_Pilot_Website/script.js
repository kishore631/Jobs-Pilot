(() => {
  "use strict";
  const jobs = Array.isArray(window.JOBS_PILOT_JOBS)
    ? window.JOBS_PILOT_JOBS
    : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const safeUrl = (value) => {
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };
  const publishedJobs = () =>
    jobs.filter(
      (job) =>
        job &&
        job.published === true &&
        job.id &&
        job.title &&
        job.company &&
        safeUrl(job.sourceUrl),
    );
  const fmtDate = (value) => {
    if (!value) return "Not specified";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };
  const initials = (name) =>
    String(name || "JP")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase();
  const activeJobs = () =>
    publishedJobs().filter(
      (job) =>
        !job.deadline ||
        Number.isNaN(new Date(`${job.deadline}T23:59:59`).getTime()) ||
        new Date(`${job.deadline}T23:59:59`) >= new Date(),
    );
  function card(job) {
    const href = `./job.html?id=${encodeURIComponent(job.id)}`;
    return `<article class="job-card">
      <div class="job-card-top"><div class="company-mark" aria-hidden="true">${escapeHTML(initials(job.company))}</div>
      <div><h3><a href="${href}">${escapeHTML(job.title)}</a></h3><p class="job-company">${escapeHTML(job.company)}</p></div></div>
      <div class="job-meta"><span class="pill">${escapeHTML(job.location || "Location not specified")}</span><span class="pill pill-blue">${escapeHTML(job.employmentType || "Job")}</span>${job.category ? `<span class="pill">${escapeHTML(job.category)}</span>` : ""}</div>
      <p class="job-summary">${escapeHTML(job.summary || "Review the official job details and eligibility before applying.")}</p>
      <div class="job-card-bottom"><span class="job-salary">${escapeHTML(job.salary || "Salary not disclosed")}</span><a class="job-card-link" href="${href}">View details →</a></div>
    </article>`;
  }
  function emptyState(title, text) {
    return `<div class="empty-state"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p></div>`;
  }
  function renderJobLists() {
    const current = activeJobs();
    const featured = $("#featured-jobs");
    if (featured)
      featured.innerHTML =
        current.slice(0, 3).map(card).join("") ||
        emptyState(
          "New opportunities are being prepared",
          "We publish listings after checking the available details. Please check back soon.",
        );
    const list = $("#all-jobs");
    if (!list) return;
    const form = $("#job-filters");
    const params = new URLSearchParams(location.search);
    const queryInput = $("#job-query"),
      locationInput = $("#job-location"),
      categoryInput = $("#job-category");
    if (queryInput) queryInput.value = params.get("q") || "";
    if (locationInput) locationInput.value = params.get("location") || "";
    if (categoryInput) categoryInput.value = params.get("category") || "";
    const applyFilters = () => {
      const q = (queryInput?.value || "").trim().toLowerCase();
      const loc = (locationInput?.value || "").trim().toLowerCase();
      const cat = (categoryInput?.value || "").trim().toLowerCase();
      const filtered = current.filter((job) => {
        const haystack = [
          job.title,
          job.company,
          job.summary,
          ...(job.skills || []),
        ]
          .join(" ")
          .toLowerCase();
        return (
          (!q || haystack.includes(q)) &&
          (!loc ||
            String(job.location || "")
              .toLowerCase()
              .includes(loc)) &&
          (!cat || String(job.category || "").toLowerCase() === cat)
        );
      });
      $("#job-result-count").textContent =
        `${filtered.length} ${filtered.length === 1 ? "opportunity" : "opportunities"} found`;
      list.innerHTML =
        filtered.map(card).join("") ||
        emptyState(
          "No matching jobs found",
          "Try another keyword or location, or clear the filters.",
        );
    };
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilters();
    });
    [queryInput, locationInput, categoryInput].forEach((el) =>
      el?.addEventListener("input", applyFilters),
    );
    $("#clear-filters")?.addEventListener("click", () => {
      if (queryInput) queryInput.value = "";
      if (locationInput) locationInput.value = "";
      if (categoryInput) categoryInput.value = "";
      history.replaceState({}, "", location.pathname);
      applyFilters();
    });
    applyFilters();
  }
  function renderJobDetail() {
    const container = $("#job-detail");
    if (!container) return;
    const id = new URLSearchParams(location.search).get("id");
    const job = activeJobs().find((item) => item.id === id);
    if (!job) {
      $("#detail-title").textContent = "Job listing not found";
      $("#detail-subtitle").textContent =
        "This listing may have expired or the link may be incorrect.";
      container.innerHTML = `<article class="content-card">${emptyState("This opportunity is unavailable", "Please browse current listings or verify the opening on the employer's official careers website.")}<p><a class="button button-primary" href="./jobs.html">Browse jobs</a></p></article><aside class="sidebar-card"><h2>Stay safe</h2><p>Verify roles and never pay to obtain a job offer.</p></aside>`;
      return;
    }
    document.title = `${job.title} at ${job.company} | Jobs Pilot`;
    $("#detail-title").textContent = job.title;
    $("#detail-subtitle").textContent =
      `${job.company} · ${job.location || "Location not specified"}`;
    const list = (arr) =>
      Array.isArray(arr) && arr.length
        ? `<ul>${arr.map((x) => `<li>${escapeHTML(x)}</li>`).join("")}</ul>`
        : "<p>Refer to the official employer listing for details.</p>";
    const applyUrl = safeUrl(job.sourceUrl);
    container.innerHTML = `<article class="content-card">
      <div class="detail-heading"><div class="company-mark" aria-hidden="true">${escapeHTML(initials(job.company))}</div><div><h2>${escapeHTML(job.title)}</h2><p>${escapeHTML(job.company)} · ${escapeHTML(job.location || "Location not specified")}</p></div></div>
      <div class="job-meta"><span class="pill">${escapeHTML(job.employmentType || "Job")}</span><span class="pill pill-blue">${escapeHTML(job.category || "Opportunity")}</span></div>
      <div class="detail-facts">
        <div class="detail-fact"><span>Experience</span><strong>${escapeHTML(job.experience || "Not specified")}</strong></div>
        <div class="detail-fact"><span>Salary</span><strong>${escapeHTML(job.salary || "Not disclosed")}</strong></div>
        <div class="detail-fact"><span>Date posted</span><strong>${escapeHTML(fmtDate(job.datePosted))}</strong></div>
        <div class="detail-fact"><span>Application deadline</span><strong>${escapeHTML(fmtDate(job.deadline))}</strong></div>
      </div>
      <section class="detail-section"><h3>About this opportunity</h3><p>${escapeHTML(job.description || job.summary || "Review the official employer listing for the full role description.")}</p></section>
      <section class="detail-section"><h3>Eligibility and qualifications</h3>${list(job.eligibility)}</section>
      <section class="detail-section"><h3>Responsibilities</h3>${list(job.responsibilities)}</section>
      <section class="detail-section"><h3>Skills</h3>${list(job.skills)}</section>
      <p class="small-note">Source: ${escapeHTML(job.officialSourceName || "Employer application page")}. Verify current availability, requirements and deadline directly with the employer.</p>
      <div class="detail-apply"><a class="button button-primary" href="${applyUrl}" target="_blank" rel="noopener noreferrer">Apply ↗</a></div>
    </article><aside class="sidebar-card"><h2>Before you apply</h2><ul><li>Confirm the role on the employer's official website.</li><li>Check all eligibility requirements and dates.</li><li>Never share passwords or one-time passcodes.</li><li>Do not pay anyone who promises a guaranteed job.</li></ul><a href="./disclaimer.html">Read our disclaimer →</a></aside>`;
  }
  function initNav() {
    const toggle = $(".nav-toggle"),
      nav = $("#primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
    const current = location.pathname.split("/").pop() || "index.html";
    $$("#primary-nav a").forEach((link) => {
      if (link.getAttribute("href")?.split("?")[0] === `./${current}`)
        link.classList.add("active");
    });
  }
  function init() {
    $$("[data-current-year]").forEach(
      (el) => (el.textContent = String(new Date().getFullYear())),
    );
    initNav();
    renderJobLists();
    renderJobDetail();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
