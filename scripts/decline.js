#!/usr/bin/env node
import fs from "fs";
import path from "path";

const [, , filename] = process.argv;

if (!filename) {
  console.error("Usage: npm run decline -- <filename.md>");
  process.exit(1);
}

const draftsDir = path.join(process.cwd(), "drafts");
const archiveDir = path.join(draftsDir, "archived");
const draftPath = path.join(draftsDir, filename);
const archivePath = path.join(archiveDir, filename);

if (!fs.existsSync(draftPath)) {
  console.error(`Draft not found: ${draftPath}`);
  process.exit(1);
}

fs.mkdirSync(archiveDir, { recursive: true });
fs.renameSync(draftPath, archivePath);
console.log(`Moved draft to archive: ${archivePath}`);
