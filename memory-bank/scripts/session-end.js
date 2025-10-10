#!/usr/bin/env node

/**
 * Memory Bank Session End Script
 * Automates the session end checklist from SESSION_GUIDE.md
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options });
  } catch (error) {
    if (!options.silent) {
      log.error(`Command failed: ${command}`);
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.log(error.stderr);
    }
    return null;
  }
}

function separator() {
  console.log(`${colors.blue}${'─'.repeat(60)}${colors.reset}`);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Get current timestamp in format: YYYY-MM-DD HH:MM
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

async function sessionEnd() {
  console.log(`
${colors.bright}${colors.blue}╔════════════════════════════════════════════════════════╗
║         Memory Bank Session End                        ║
╚════════════════════════════════════════════════════════╝${colors.reset}
  `);

  // 1. Code Cleanup
  log.header('🧹 Code Cleanup');
  separator();

  // Run linting
  log.info('Running linter...');
  const lintResult = exec('npm run lint', { silent: true });
  if (lintResult !== null) {
    log.success('Linting passed');
  } else {
    log.warning('Linting found issues (review above)');
  }

  // Check TypeScript
  log.info('Checking TypeScript...');
  const tscResult = exec('npx tsc --noEmit', { silent: true });
  if (tscResult !== null) {
    log.success('TypeScript check passed');
  } else {
    log.warning('TypeScript errors found (review above)');
  }

  // Check git status
  log.info('Checking git status...');
  const gitStatus = exec('git status --short');
  if (gitStatus && gitStatus.trim()) {
    log.warning('You have uncommitted changes:');
    console.log(gitStatus);
  } else {
    log.success('Working directory is clean');
  }

  // 2. Gather Session Information
  log.header('\n📝 Session Information');
  separator();

  const timestamp = getTimestamp();
  console.log(`\n${colors.cyan}Session timestamp: ${timestamp}${colors.reset}\n`);

  const sessionTitle = await question('Session title (brief description): ');
  const summary = await question('Session summary (what was accomplished): ');

  console.log('\nEnter completed items (one per line, empty line to finish):');
  const completed = [];
  while (true) {
    const item = await question('  ✅ ');
    if (!item.trim()) break;
    completed.push(item);
  }

  console.log('\nEnter in-progress items (one per line, empty line to finish):');
  const inProgress = [];
  while (true) {
    const item = await question('  🔄 ');
    if (!item.trim()) break;
    inProgress.push(item);
  }

  console.log('\nEnter blocked items (one per line, empty line to finish):');
  const blocked = [];
  while (true) {
    const item = await question('  ❌ ');
    if (!item.trim()) break;
    blocked.push(item);
  }

  console.log('\nEnter technical decisions (one per line, empty line to finish):');
  const decisions = [];
  while (true) {
    const item = await question('  💡 ');
    if (!item.trim()) break;
    decisions.push(item);
  }

  console.log('\nEnter next session priorities (one per line, empty line to finish):');
  const nextSession = [];
  while (true) {
    const item = await question('  ⏭️  ');
    if (!item.trim()) break;
    nextSession.push(item);
  }

  const notes = await question('\nAdditional notes (optional): ');

  // 3. Update PROGRESS.md
  log.header('\n📊 Updating Memory Bank');
  separator();

  const memoryBankPath = path.join(process.cwd(), 'memory-bank');
  const progressPath = path.join(memoryBankPath, 'PROGRESS.md');

  let progressEntry = `\n## [${timestamp}] - ${sessionTitle}\n\n`;
  progressEntry += `### Summary\n${summary}\n\n`;

  if (completed.length > 0) {
    progressEntry += `### Completed\n`;
    completed.forEach(item => {
      progressEntry += `- ✅ ${item}\n`;
    });
    progressEntry += '\n';
  }

  if (inProgress.length > 0) {
    progressEntry += `### In Progress\n`;
    inProgress.forEach(item => {
      progressEntry += `- 🔄 ${item}\n`;
    });
    progressEntry += '\n';
  }

  if (blocked.length > 0) {
    progressEntry += `### Blocked\n`;
    blocked.forEach(item => {
      progressEntry += `- ❌ ${item}\n`;
    });
    progressEntry += '\n';
  }

  if (decisions.length > 0) {
    progressEntry += `### Technical Decisions\n`;
    decisions.forEach(item => {
      progressEntry += `- ${item}\n`;
    });
    progressEntry += '\n';
  }

  if (nextSession.length > 0) {
    progressEntry += `### Next Session\n`;
    nextSession.forEach(item => {
      progressEntry += `- ${item}\n`;
    });
    progressEntry += '\n';
  }

  if (notes) {
    progressEntry += `### Notes\n${notes}\n\n`;
  }

  // Append to PROGRESS.md
  fs.appendFileSync(progressPath, progressEntry);
  log.success('PROGRESS.md updated');

  // 4. Update CURRENT.md timestamp
  const currentPath = path.join(memoryBankPath, 'CURRENT.md');
  if (fs.existsSync(currentPath)) {
    let currentContent = fs.readFileSync(currentPath, 'utf8');

    // Update the Last Updated timestamp
    currentContent = currentContent.replace(
      /\*\*Last Updated:\*\* .*/,
      `**Last Updated:** ${timestamp}`
    );

    fs.writeFileSync(currentPath, currentContent);
    log.success('CURRENT.md timestamp updated');
    log.warning('Remember to manually update CURRENT.md sections as needed');
  }

  // 5. Git Status Summary
  log.header('\n📦 Git Status');
  separator();

  const changedFiles = exec('git diff --name-only');
  const untrackedFiles = exec('git ls-files --others --exclude-standard');

  if (changedFiles && changedFiles.trim()) {
    log.info('Modified files:');
    console.log(changedFiles);
  }

  if (untrackedFiles && untrackedFiles.trim()) {
    log.info('Untracked files:');
    console.log(untrackedFiles);
  }

  // 6. Final Checklist
  log.header('\n✅ Final Checklist');
  separator();

  console.log(`
${colors.bright}Before ending your session, ensure:${colors.reset}

  [ ] All changes committed to git
  [ ] Memory bank files updated (PROGRESS.md, CURRENT.md)
  [ ] No sensitive data in commits
  [ ] Build still works (npm run build)
  [ ] Ready to push to remote

${colors.bright}Suggested git commands:${colors.reset}

  ${colors.cyan}# Stage memory bank updates${colors.reset}
  git add memory-bank/

  ${colors.cyan}# Commit memory bank${colors.reset}
  git commit -m "docs: Update memory bank - ${sessionTitle}"

  ${colors.cyan}# Stage and commit code changes${colors.reset}
  git add .
  git commit -m "feat/fix/refactor: [your change description]"

  ${colors.cyan}# Push changes${colors.reset}
  git push origin main

${colors.bright}Memory Bank Files Updated:${colors.reset}
  ${colors.green}✓${colors.reset} PROGRESS.md - New session entry added
  ${colors.green}✓${colors.reset} CURRENT.md - Timestamp updated

  `);

  log.header('✨ Session End Complete!');
  console.log(`${colors.green}Great work! Don't forget to commit and push your changes.${colors.reset}\n`);

  rl.close();
}

// Run the script
sessionEnd().catch(error => {
  log.error(`Session end failed: ${error.message}`);
  rl.close();
  process.exit(1);
});
