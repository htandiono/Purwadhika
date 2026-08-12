document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const setMenu = (open) => {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
  header?.classList.toggle("is-menu-open", open);

  if (open) {
    mobileMenu.querySelector("a")?.focus();
  }
};

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 780 && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
  }
});

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visibleEntry.target.id}`;
        if (isCurrent) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-25% 0px -62%", threshold: [0, 0.2, 0.5] },
  );

  observedSections.forEach((section) => navObserver.observe(section));
}

const caseTabs = [...document.querySelectorAll("[data-case-tab]")];
const casePanels = [...document.querySelectorAll("[data-case-panel]")];

const activateCase = (caseId, focusTab = false) => {
  caseTabs.forEach((tab) => {
    const active = tab.dataset.caseTab === caseId;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focusTab) tab.focus();
  });

  casePanels.forEach((panel) => {
    const active = panel.dataset.casePanel === caseId;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
};

caseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCase(tab.dataset.caseTab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;

    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % caseTabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      nextIndex = (index - 1 + caseTabs.length) % caseTabs.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = caseTabs.length - 1;

    activateCase(caseTabs[nextIndex].dataset.caseTab, true);
  });
});

const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = text;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();
  document.execCommand("copy");
  temporaryInput.remove();
};

copyButton?.addEventListener("click", async () => {
  const email = copyButton.dataset.copyEmail;

  try {
    await copyText(email);
    copyStatus.textContent = "Email copied to your clipboard.";
    copyButton.querySelector("strong").textContent = "Copied";
  } catch {
    copyStatus.textContent = `Copy unavailable — email ${email} directly.`;
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
    copyButton.querySelector("strong").textContent = "Copy";
  }, 3000);
});

const detailContent = {
  frontend: {
    kicker: "Expertise 01 / Frontend",
    title: "Interfaces that make complex systems feel clear.",
    summary:
      "I treat frontend work as product engineering: information hierarchy, responsive behavior, state, validation, accessibility, and the API contract all have to support the same user task.",
    leftTitle: "Core capabilities",
    left: [
      "Responsive product and administration interfaces",
      "Typed forms, validation, loading, and failure states",
      "Server and client data flows with clear component boundaries",
      "Accessible navigation, keyboard behavior, and interaction feedback",
    ],
    rightTitle: "Applied recently",
    right: [
      "Next.js administration surfaces for Langkah Sehat",
      "Event discovery, organizer tools, and checkout UI for Eventure",
      "Shared design and data contracts in collaborative monorepos",
    ],
    stack: ["React", "Next.js", "TypeScript", "CSS", "React Query", "Zod"],
    note: "The goal is not visual novelty for its own sake. It is a product that feels obvious to use and remains understandable to the team maintaining it.",
  },
  mobile: {
    kicker: "Expertise 02 / Mobile",
    title: "Cross-platform mobile work that respects the device.",
    summary:
      "My recent mobile work combines React Native product delivery with native health-data access, secure local storage, background synchronization, and practical release packaging.",
    leftTitle: "Core capabilities",
    left: [
      "Expo and React Native application architecture",
      "Android Health Connect and iOS HealthKit integration",
      "Batched background synchronization and secure on-device state",
      "EAS development builds and signed Android release artifacts",
    ],
    rightTitle: "Engineering priorities",
    right: [
      "Avoid double-counting cumulative step data",
      "Reduce battery impact by avoiding continuous GPS loops",
      "Validate suspicious activity on the server side",
      "Keep Android delivery practical while retaining an iOS path",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Health Connect", "HealthKit", "EAS"],
    note: "Langkah Sehat was delivered as a signed evaluation APK. Its production employee deployment still requires live identity and database credentials.",
  },
  backend: {
    kicker: "Expertise 03 / Backend",
    title: "Business rules deserve more than a happy-path API.",
    summary:
      "I structure backend work around explicit contracts, authorization, ownership, validation, transactional boundaries, and recovery when a workflow does not finish as planned.",
    leftTitle: "Core capabilities",
    left: [
      "REST APIs with schema validation and clear error responses",
      "Authentication, role-based access, and resource ownership checks",
      "Transactional workflows for inventory, discounts, and points",
      "Cross-service configuration and deployment-aware debugging",
    ],
    rightTitle: "Applied recently",
    right: [
      "Serializable checkout and conditional seat updates in Eventure",
      "Atomic lifecycle restoration after cancellation or rejection",
      "Registration approval and administrative actions in Langkah Sehat",
    ],
    stack: ["Node.js", "Express", "TypeScript", "REST", "RBAC", "Zod"],
    note: "Reliability is treated as a user-facing feature: a failed request should not leave inventory, points, or access rules in an ambiguous state.",
  },
  data: {
    kicker: "Expertise 04 / Data",
    title: "A database foundation shaped by operations, not demos.",
    summary:
      "My background spans sales analysis, retail databases, agricultural research data, GIS workflows, and current relational product models. That experience makes data integrity part of design from the beginning.",
    leftTitle: "Core capabilities",
    left: [
      "Relational modeling for operational domains",
      "Complex SQL, reporting, automation, and performance work",
      "Prisma schemas and transactional application access",
      "Spatial and field-data workflows with GIS tooling",
    ],
    rightTitle: "Domain experience",
    right: [
      "Retail and sales activity tracking",
      "Agricultural research and traceability",
      "Logistics, purchase orders, and operational monitoring",
      "Events, ticket inventory, employee wellbeing, and competitions",
    ],
    stack: ["PostgreSQL", "Prisma", "SQL Server", "MS Access", "Python", "MapInfo"],
    note: "The strongest database is not the most complicated one. It is the one that represents the real workflow accurately and protects the invariants the business depends on.",
  },
  "langkah-sehat": {
    kicker: "Recent build 01 / Mobile + Admin",
    title: "Langkah Sehat",
    summary:
      "A branded company step-tracking platform designed for employee participation, health-data efficiency, credible competitions, and practical administration.",
    leftTitle: "Product scope",
    left: [
      "Employee onboarding, profiles, leaderboards, and competitions",
      "Registration review and department management",
      "Health-data synchronization with duplicate-count protection",
      "Anti-cheat rules and Jakarta-aware competition dates",
    ],
    rightTitle: "Delivery evidence",
    right: [
      "Cross-platform Expo / React Native mobile architecture",
      "Signed Android evaluation APK with validated package contents",
      "Next.js administration portal deployed on Vercel",
      "Shared core and database foundations in a pnpm monorepo",
    ],
    stack: ["Expo", "React Native", "Next.js", "TypeScript", "Clerk", "Neon", "Vercel"],
    note: "Scope note: the released APK is a demo/evaluation build. Production Clerk, Neon, and API configuration was not supplied, so it is not presented as a production-connected employee release.",
  },
  eventure: {
    kicker: "Recent build 02 / Collaborative platform",
    title: "Eventure",
    summary:
      "A collaborative event-management monorepo covering discovery, organizer workflows, tickets, promotions, points, checkout, payment proof, transaction lifecycle, and reviews.",
    leftTitle: "System design",
    left: [
      "Next.js frontend, Express API, shared contracts, and Prisma database package",
      "Twelve-model relational domain for events and transactions",
      "Role-based access followed by resource ownership enforcement",
      "Search debounce with stale-request cancellation",
    ],
    rightTitle: "Reliability work",
    right: [
      "Serializable checkout with conditional seat decrements",
      "Integer-rupiah voucher, coupon, and points calculations",
      "Atomic restoration of seats and benefits across lifecycle changes",
      "Hosted transaction diagnosis and reversible production verification",
    ],
    stack: ["Next.js", "React", "Express", "TypeScript", "Prisma", "PostgreSQL", "Vercel"],
    note: "Eventure is a shared project. This portfolio presents the system areas and engineering work without claiming sole authorship or hiding known implementation limitations.",
  },
  traceability: {
    kicker: "Career foundation / Field systems",
    title: "Traceability and digital field recording",
    summary:
      "Early operational software work combined field observation, research requirements, barcode identification, Android collection, and database design.",
    leftTitle: "Work covered",
    left: [
      "Barcode tracking for oil-palm plant-breeding trials",
      "Android recording for field upkeep, manuring, and harvesting inspection",
      "Traceability database development",
      "Prototypes grounded in direct observation of field workflows",
    ],
    rightTitle: "Lasting value",
    right: [
      "Reduced manual transcription between field and office",
      "Connected physical activities to structured records",
      "Improved the accuracy and timeliness of operational data",
    ],
    stack: ["Android", "Barcode", "SQL Server", "MS Access", "Field operations"],
  },
  gis: {
    kicker: "Career foundation / GIS",
    title: "Automated mapping for research operations",
    summary:
      "A custom mapping workflow combined GIS software and operational databases to make repeatable spatial analysis more efficient for a genetic research center.",
    leftTitle: "Work covered",
    left: [
      "Automated map production from structured operational data",
      "MapInfo workflows connected with database records",
      "Spatial analysis support for research and planning",
    ],
    rightTitle: "Lasting value",
    right: [
      "Turned repetitive mapping steps into a reusable process",
      "Linked spatial outputs with source records",
      "Bridged domain experts, data, and technical implementation",
    ],
    stack: ["MapInfo", "MS Access", "SQL", "GIS", "Automation"],
  },
  research: {
    kicker: "Career foundation / R&D",
    title: "Research data and decision support",
    summary:
      "Database and application work supported plant-breeding trials, bunch-analysis laboratories, field inspection, and fertilizer recommendation workflows.",
    leftTitle: "Work covered",
    left: [
      "Research and laboratory database maintenance",
      "Application prototypes for full-scale IT implementation",
      "Decision-support components for fertilizer recommendations",
      "Analysis of ground-level workflows before system design",
    ],
    rightTitle: "Lasting value",
    right: [
      "Improved data collection accuracy and processing efficiency",
      "Translated research requirements into technical specifications",
      "Built practical trust between operations and technology teams",
    ],
    stack: ["SQL Server", "MS Access", "VBA", "DSS", "Research data"],
  },
};

const detailDialog = document.querySelector("[data-detail-dialog]");
const dialogTitle = detailDialog?.querySelector("[data-dialog-title]");
const dialogKicker = detailDialog?.querySelector("[data-dialog-kicker]");
const dialogSummary = detailDialog?.querySelector("[data-dialog-summary]");
const dialogLeftTitle = detailDialog?.querySelector("[data-dialog-left-title]");
const dialogRightTitle = detailDialog?.querySelector("[data-dialog-right-title]");
const dialogLeft = detailDialog?.querySelector("[data-dialog-left]");
const dialogRight = detailDialog?.querySelector("[data-dialog-right]");
const dialogStack = detailDialog?.querySelector("[data-dialog-stack]");
const dialogNote = detailDialog?.querySelector("[data-dialog-note]");
let lastModalTrigger = null;

const fillList = (element, items) => {
  element.replaceChildren(...items.map((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    return listItem;
  }));
};

const openDetail = (id, trigger) => {
  const content = detailContent[id];
  if (!content || !detailDialog) return;

  dialogKicker.textContent = content.kicker;
  dialogTitle.textContent = content.title;
  dialogSummary.textContent = content.summary;
  dialogLeftTitle.textContent = content.leftTitle;
  dialogRightTitle.textContent = content.rightTitle;
  fillList(dialogLeft, content.left);
  fillList(dialogRight, content.right);
  dialogStack.replaceChildren(...content.stack.map((item) => {
    const badge = document.createElement("span");
    badge.textContent = item;
    return badge;
  }));
  if (content.note) {
    dialogNote.textContent = content.note;
    dialogNote.hidden = false;
  } else {
    dialogNote.textContent = "";
    dialogNote.hidden = true;
  }

  lastModalTrigger = trigger;
  document.body.classList.add("dialog-open");
  detailDialog.showModal();
};

document.querySelectorAll("[data-modal-id]").forEach((trigger) => {
  trigger.addEventListener("click", () => openDetail(trigger.dataset.modalId, trigger));
});

const closeDetail = () => {
  if (!detailDialog?.open) return;
  detailDialog.close();
};

detailDialog?.querySelector("[data-dialog-close]")?.addEventListener("click", closeDetail);

detailDialog?.addEventListener("click", (event) => {
  const bounds = detailDialog.getBoundingClientRect();
  const inside =
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom;

  if (!inside) closeDetail();
});

detailDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  lastModalTrigger?.focus();
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
