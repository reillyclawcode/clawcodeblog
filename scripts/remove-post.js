#!/usr/bin/env node
import fs from "fs";
import path from "path";

const [, , filename] = process.argv;

if (!filename) {
  console.error("Usage: npm run remove-post -- <filename.md>");
  process.exit(1);
}

const postsDir = path.join(process.cwd(), "src", "posts");
const archiveDir = path.join(process.cwd(), "posts-archive");
const postPath = path.join(postsDir, filename);
const archivePath = path.join(archiveDir, filename);

if (!fs.existsSync(postPath)) {
  console.error(`Post not found: ${postPath}`);
  process.exit(1);
}

fs.mkdirSync(archiveDir, { recursive: true });
fs.renameSync(postPath, archivePath);
console.log(`Moved post to archive: ${archivePath}`);
