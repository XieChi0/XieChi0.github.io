#!/usr/bin/env node

const { execSync } = require('child_process');

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

console.log(`\n${colors.yellow}═══════════════════════════════════════════`);
console.log(`${colors.yellow}  Pre-commit Hook`);
console.log(`${colors.yellow}═══════════════════════════════════════════\n`);

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
