#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

const log = (color, symbol, ...args) => {
  console.log(`${color}${symbol}${colors.reset}`, ...args);
};

const run = (command, name) => {
  console.log(`\n${colors.yellow}[${name}]${colors.reset} Running: ${command}`);
  console.log('─'.repeat(50));
  try {
    execSync(command, { stdio: 'inherit' });
    log(colors.green, '✓', `${name} passed`);
    return true;
  } catch (error) {
    log(colors.red, '✗', `${name} failed`);
    console.log(`\n${colors.cyan}Tip:${colors.reset} Run the command manually to debug:`);
    console.log(`  ${colors.cyan}npx ${command.replace('npx ', '')}${colors.reset}\n`);
    return false;
  }
};

// Frontmatter 格式检查
const checkFrontmatter = () => {
  console.log(`\n${colors.yellow}[0/4 Frontmatter Check]${colors.reset} Checking markdown frontmatter...`);
  console.log('─'.repeat(50));

  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  let hasError = false;

  const scanDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = path.relative(process.cwd(), fullPath);

        // 找到 frontmatter 的结束位置
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (!frontmatterMatch) {
          // 检查是否有未闭合的 frontmatter
          const openCount = (content.match(/^---/gm) || []).length;
          if (openCount === 1) {
            console.log(`${colors.red}✗${colors.reset} ${relativePath}: Frontmatter not properly closed`);
            hasError = true;
          }
          continue;
        }

        const frontmatter = frontmatterMatch[1];

        // 检查 frontmatter 内是否有单独的空行（可能导致 YAML 解析问题）
        const lines = frontmatter.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // 检查是否有只有空格的行（不是缩进）
          if (/^\s+$/.test(line) && line !== '') {
            console.log(`${colors.red}✗${colors.reset} ${relativePath}: Empty line in frontmatter at line ${i + 2}`);
            hasError = true;
          }
        }
      }
    }
  };

  try {
    scanDir(postsDir);

    if (hasError) {
      console.log(`\n${colors.red}✗${colors.reset} Frontmatter check failed`);
      console.log(`\n${colors.cyan}Tip:${colors.reset} Ensure frontmatter has no blank lines between fields.`);
      return false;
    }

    log(colors.green, '✓', 'Frontmatter check passed');
    return true;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Error scanning files: ${error.message}`);
    return false;
  }
};

console.log(`\n${colors.yellow}═══════════════════════════════════════════`);
console.log(`${colors.yellow}  Pre-commit Hook`);
console.log(`${colors.yellow}═══════════════════════════════════════════\n`);

// 先检查 frontmatter
if (!checkFrontmatter()) {
  console.log(`${colors.yellow}═══════════════════════════════════════════`);
  console.log(`${colors.red}  Frontmatter check failed! ✗`);
  console.log(`${colors.yellow}═══════════════════════════════════════════\n`);
  process.exit(1);
}

const steps = [
  { cmd: 'astro check', name: '1/3 Astro Check' },
  { cmd: 'astro build', name: '2/3 Astro Build' },
  { cmd: 'biome ci ./src', name: '3/3 Biome CI' },
];

let failed = false;
for (const step of steps) {
  if (!run(`npx ${step.cmd}`, step.name)) {
    failed = true;
    break;
  }
}

console.log(`${colors.yellow}═══════════════════════════════════════════`);
if (failed) {
  console.log(`${colors.red}  Some checks failed! ✗`);
  console.log(`${colors.yellow}═══════════════════════════════════════════\n`);
  console.log(`${colors.red}Troubleshooting:`);
  console.log('  1. Check for missing images in markdown files');
  console.log('  2. Check for TypeScript errors');
  console.log('  3. Check for biome/lint errors');
  console.log('');
  process.exit(1);
} else {
  console.log(`${colors.green}  All checks passed! ✓`);
  console.log(`${colors.yellow}═══════════════════════════════════════════\n`);
  process.exit(0);
}
