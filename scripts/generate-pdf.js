import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "..", "src", "assets", "civilization-research-paper.pdf");

const URL = process.argv[2] || "http://localhost:8081/research/ai-civilization/";

async function generate() {
  console.log(`Opening ${URL} …`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30_000 });

  // CRITICAL: render with "screen" media so all regular CSS applies.
  // Without this, Puppeteer uses @media print which can drop colours.
  await page.emulateMediaType("screen");

  // Wait for fonts to settle
  await new Promise((r) => setTimeout(r, 2000));

  // Hide nav-only elements and flatten to single column
  await page.evaluate(() => {
    const hide = (sel) => document.querySelectorAll(sel).forEach(el => el.style.display = "none");

    hide(".header-links");
    hide(".header-stats");
    hide(".toc-sidebar");
    hide(".toc-mobile-toggle");
    hide(".site-footer");

    // Single-column layout for PDF
    document.querySelectorAll(".research-shell").forEach(el => {
      el.style.gridTemplateColumns = "1fr";
      el.style.maxWidth = "100%";
    });

    // Hide "Continue reading" web-nav section at the bottom
    const dividers = document.querySelectorAll(".divider-label");
    dividers.forEach(el => {
      if (el.id === "related") {
        let node = el;
        while (node) {
          const next = node.nextElementSibling;
          node.style.display = "none";
          node = next;
        }
      }
    });

    // Inject PDF-safe overrides
    const style = document.createElement("style");
    style.textContent = `
      /* CRITICAL: Chromium PDF renderer breaks with backdrop-filter,
         causing elements to render as solid opaque rectangles that
         hide all text. Strip it everywhere. */
      * {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* Kill ambient glow pseudo-elements */
      body::before, body::after,
      .post-body::before, .post-body::after { display: none !important; }

      /* Make card backgrounds slightly more opaque to compensate
         for the loss of blur (otherwise they become transparent) */
      .feature-card, .callout, .run-card, .phase-card,
      .hero-banner, .highlight-strip, .stat-item,
      .timeline-item, .step, .post-card, .featured-card,
      .quick-link-card, .research-content {
        background-color: rgba(15, 23, 42, 0.85) !important;
      }

      /* Hero banners keep their gradient overlays */
      .hero-banner--sky    { background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(56, 189, 248, 0.08)) !important; }
      .hero-banner--emerald{ background: linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(52, 211, 153, 0.08)) !important; }
      .hero-banner--violet { background: linear-gradient(135deg, rgba(139, 92, 246, 0.18), rgba(167, 139, 250, 0.08)) !important; }
      .hero-banner--amber  { background: linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(251, 191, 36, 0.08)) !important; }
      .hero-banner--rose   { background: linear-gradient(135deg, rgba(244, 63, 94, 0.18), rgba(251, 113, 133, 0.08)) !important; }

      /* Let all containers break freely across pages */
      .feature-grid, .steps, .timeline, .stat-row,
      .feature-card, .run-card, .phase-card, .callout,
      .hero-banner, .highlight-strip {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }

      /* Keep headers glued to following content */
      h2, h3 {
        break-after: avoid;
        page-break-after: avoid;
      }
    `;
    document.head.appendChild(style);
  });

  console.log("Generating PDF …");
  await page.pdf({
    path: outputPath,
    format: "A4",
    margin: { top: "0.75in", right: "0.6in", bottom: "0.75in", left: "0.6in" },
    printBackground: true,
    preferCSSPageSize: false,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width:100%;font-size:8px;color:#94a3b8;font-family:Inter,sans-serif;padding:0 0.6in;display:flex;justify-content:space-between;">
        <span>Clawcode Research</span>
        <span>Reclaiming the Future — AI Alignment, Societal Resilience, and Civilization Trajectories</span>
      </div>`,
    footerTemplate: `
      <div style="width:100%;font-size:8px;color:#94a3b8;font-family:Inter,sans-serif;padding:0 0.6in;display:flex;justify-content:space-between;">
        <span>clawcode.github.io</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`,
  });

  await browser.close();
  console.log(`PDF saved to ${outputPath}`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
