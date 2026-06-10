#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const workspaceRoot = process.cwd();
const postDir = path.join(workspaceRoot, 'src', 'content', 'posts', '业务', '面试');
const assetsDir = path.join(postDir, 'assets');
const defaultTyporaDir = path.join(
  process.env.APPDATA ?? path.join(process.env.USERPROFILE ?? '', 'AppData', 'Roaming'),
  'Typora',
  'typora-user-images',
);

const markdownImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
const htmlImageRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g;
const localImagePattern = /([^\\/]+\.(png|jpe?g|gif|webp|svg))/i;

function normalizeSlashes(value) {
  return value.replace(/\\/g, '/');
}

function getFileNameFromReference(reference) {
  const normalized = normalizeSlashes(reference).trim();
  const matched = normalized.match(localImagePattern);
  return matched ? matched[1] : null;
}

function shouldRewriteReference(reference) {
  return (
    reference.includes('Typora/typora-user-images') ||
    reference.includes('Typora\\typora-user-images') ||
    reference.includes('面试题.assets') ||
    reference.startsWith('./assets/') ||
    reference.startsWith('C:/Users/') ||
    reference.startsWith('C:\\Users\\') ||
    reference.startsWith('./../AppData/')
  );
}

async function readMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(dir, entry.name));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function collectReferences(content) {
  const refs = [];

  for (const regex of [markdownImageRegex, htmlImageRegex]) {
    regex.lastIndex = 0;
    for (const match of content.matchAll(regex)) {
      const reference = match[1];
      const fileName = getFileNameFromReference(reference);
      if (!reference || !fileName) continue;
      refs.push({ reference, fileName });
    }
  }

  return refs;
}

async function main() {
  const sourceDir = process.argv[2]
    ? path.resolve(workspaceRoot, process.argv[2])
    : defaultTyporaDir;

  await ensureDir(assetsDir);

  const markdownFiles = await readMarkdownFiles(postDir);
  const missing = [];
  const copied = [];
  const rewrittenFiles = [];

  for (const markdownFile of markdownFiles) {
    const original = await fs.readFile(markdownFile, 'utf8');
    const references = collectReferences(original);
    let nextContent = original;
    let changed = false;

    for (const { reference, fileName } of references) {
      const targetPath = path.join(assetsDir, fileName);
      const sourcePath = path.join(sourceDir, fileName);
      const targetReference = `./assets/${fileName}`;

      if (await fileExists(targetPath)) {
        if (shouldRewriteReference(reference) && reference !== targetReference) {
          nextContent = nextContent.split(reference).join(targetReference);
          changed = true;
        }
        continue;
      }

      if (await fileExists(sourcePath)) {
        await fs.copyFile(sourcePath, targetPath);
        copied.push(fileName);
        if (reference !== targetReference) {
          nextContent = nextContent.split(reference).join(targetReference);
          changed = true;
        }
        continue;
      }

      missing.push({ markdownFile, fileName, reference, searchedIn: sourceDir });
    }

    if (changed) {
      await fs.writeFile(markdownFile, nextContent, 'utf8');
      rewrittenFiles.push(path.relative(workspaceRoot, markdownFile));
    }
  }

  const summary = {
    sourceDir,
    copied: [...new Set(copied)].sort(),
    rewrittenFiles,
    missing,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
