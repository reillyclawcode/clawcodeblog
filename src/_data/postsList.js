import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src", "posts");

export default function readPosts() {
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map((filename) => {
      const fullPath = path.join(postsDir, filename);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const parsed = matter(raw);
      return {
        filename,
        title: parsed.data.title || filename,
        description: parsed.data.description || "",
        date: parsed.data.date || null
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
