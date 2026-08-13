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
    copyStatus.textContent = `Copy failed. Email ${email} directly.`;
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
    copyButton.querySelector("strong").textContent = "Copy";
  }, 3000);
});

const detailContent = {
  frontend: {
    kicker: "Expertise 01 / Frontend",
    title: "Frontend work should make the next step obvious.",
    summary:
      "I build React and Next.js interfaces for day-to-day product work, including forms, loading states, errors, keyboard navigation, and API-driven data.",
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
    note: "Users should know what to do next, and maintainers should be able to follow the code.",
  },
  mobile: {
    kicker: "Expertise 02 / Mobile",
    title: "Mobile apps that use health data without constant location tracking.",
    summary:
      "For Langkah Sehat, I used React Native and Expo with Health Connect, HealthKit, secure local storage, background sync, and a signed Android build.",
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
    note: "The current Langkah Sehat APK is an evaluation build. A production release still needs live Clerk, Neon, and API credentials.",
  },
  backend: {
    kicker: "Expertise 03 / Backend",
    title: "APIs need to handle the failure path too.",
    summary:
      "I define authorization, ownership, validation, and transaction boundaries before implementing a workflow, then decide what should happen when a step fails.",
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
      "Restore seats, vouchers, coupons, and points together after cancellation or rejection",
      "Registration approval and administrative actions in Langkah Sehat",
    ],
    stack: ["Node.js", "Express", "TypeScript", "REST", "RBAC", "Zod"],
    note: "When a request fails, inventory, points, and permissions should still end in a known state.",
  },
  data: {
    kicker: "Expertise 04 / Data",
    title: "Database work grounded in day-to-day operations.",
    summary:
      "I started with retail and agricultural data, then moved into GIS automation and relational product models. That background makes me pay close attention to constraints, ownership, and reporting needs.",
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
    note: "I prefer the simplest schema that matches the workflow and protects the rules the business relies on.",
  },
  "langkah-sehat": {
    kicker: "Recent build 01 / Mobile + Admin",
    title: "Langkah Sehat",
    summary:
      "A company step-tracking app and admin portal with onboarding, leaderboards, competitions, department management, and health-data sync.",
    leftTitle: "Product scope",
    left: [
      "Employee onboarding, profiles, leaderboards, and competitions",
      "Registration review and department management",
      "Health-data synchronization with duplicate-count protection",
      "Anti-cheat rules and Jakarta-aware competition dates",
    ],
    rightTitle: "What is running",
    right: [
      "Cross-platform Expo / React Native mobile architecture",
      "Signed Android evaluation APK with validated package contents",
      "Next.js administration portal deployed on Vercel",
      "Shared core and database foundations in a pnpm monorepo",
    ],
    stack: ["Expo", "React Native", "Next.js", "TypeScript", "Clerk", "Neon", "Vercel"],
    note: "The APK is an evaluation build. Production use requires live Clerk, Neon, and API credentials.",
  },
  eventure: {
    kicker: "Recent build 02 / Collaborative platform",
    title: "Eventure",
    summary:
      "A shared event platform with discovery, organizer tools, ticketing, promotions, points, checkout, payment proof, and reviews.",
    leftTitle: "System design",
    left: [
      "Next.js frontend, Express API, shared contracts, and Prisma database package",
      "Prisma schema with 12 models covering users, events, tickets, transactions, and reviews",
      "Role checks plus ownership checks for organizer resources",
      "Search debounce with stale-request cancellation",
    ],
    rightTitle: "Reliability work",
    right: [
      "Serializable checkout with conditional seat decrements",
      "Integer-rupiah voucher, coupon, and points calculations",
      "Atomic restoration of seats and benefits across lifecycle changes",
      "Production checkout debugging with seat counts restored after each test",
    ],
    stack: ["Next.js", "React", "Express", "TypeScript", "Prisma", "PostgreSQL", "Vercel"],
    note: "Eventure is a shared project. These notes describe the areas I worked on and do not claim sole authorship.",
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
    rightTitle: "What it connected",
    right: [
      "Moved field records into a structured workflow",
      "Connected physical activities to structured records",
      "Made field records available for office review",
    ],
    stack: ["Android", "Barcode", "SQL Server", "MS Access", "Field operations"],
  },
  gis: {
    kicker: "Career foundation / GIS",
    title: "Automated mapping for research operations",
    summary:
      "A custom mapping workflow combined GIS software and operational databases for repeatable spatial analysis at a genetic research center.",
    leftTitle: "Work covered",
    left: [
      "Automated map production from structured operational data",
      "MapInfo workflows connected with database records",
      "Spatial analysis support for research and planning",
    ],
    rightTitle: "What the tool did",
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
    rightTitle: "What it supported",
    right: [
      "Supported structured data collection and analysis",
      "Translated research requirements into technical specifications",
      "Documented field and laboratory requirements for the implementation team",
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
