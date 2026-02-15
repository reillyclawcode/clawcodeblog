#!/usr/bin/env node
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const [, , filename] = process.argv;

if (!filename) {
  console.error("Usage: npm run approve -- <filename.md>");
  process.exit(1);
}

const draftsDir = path.join(process.cwd(), "drafts");
const postsDir = path.join(process.cwd(), "src", "posts");
const draftPath = path.join(draftsDir, filename);
const postPath = path.join(postsDir, filename);

if (!fs.existsSync(draftPath)) {
  console.error(`Draft not found: ${draftPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(draftPath, "utf-8");
const parsed = matter(raw);

const cleanedContent = parsed.content
  .split("\n")
  .filter((line) => !line.toLowerCase().startsWith("> status"))
  .join("\n")
  .trim();

const updatedData = {
  ...parsed.data,
  date: new Date().toISOString()
};

const output = matter.stringify(cleanedContent + "\n", updatedData);
fs.mkdirSync(postsDir, { recursive: true });
fs.writeFileSync(postPath, output, "utf-8");
fs.unlinkSync(draftPath);

console.log(`Approved → ${postPath}`);
