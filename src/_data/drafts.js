import fs from "fs";
import path from "path";
import matter from "gray-matter";

const draftsDir = path.join(process.cwd(), "drafts");

function readDrafts() {
  if (!fs.existsSync(draftsDir)) {
    return [];
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const files = fs
    .readdirSync(draftsDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md");

  return files
    .map((filename) => {
      const fullPath = path.join(draftsDir, filename);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const parsed = matter(raw);
      const updated = fs.statSync(fullPath).mtime;

      return {
        filename,
        slug: filename.replace(/\.md$/, ""),
        content: parsed.content.trim(),
        data: parsed.data,
        statusBlock: parsed.content
          .split("\n")
          .find((line) => line.toLowerCase().includes("status")) || null,
        updated,
        updatedFormatted: formatter.format(updated)
      };
    })
    .sort((a, b) => b.updated - a.updated);
}

export default readDrafts();
