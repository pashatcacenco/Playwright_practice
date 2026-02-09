const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WATCH_DIRS = [
  'src'
];

const WATCH_FILES = [
  'package.json',
  'angular.json',
  'tsconfig.json',
  'tslint.json',
  '.browserslistrc',
  '.editorconfig',
  '.prettierignore',
  '.stylelintrc.json'
];

const COMMIT_MESSAGE = process.env.AUTO_COMMIT_MESSAGE || 'chore: auto-commit';
const DEBOUNCE_MS = Number.parseInt(process.env.AUTO_COMMIT_DEBOUNCE_MS || '5000', 10);

let timer = null;
let pending = false;

function hasChanges() {
  try {
    const out = execSync('git status --porcelain', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return out.length > 0;
  } catch (_) {
    return false;
  }
}

function tryCommit() {
  if (!pending) return;
  pending = false;

  if (!hasChanges()) return;

  try {
    execSync('git add -A', { stdio: 'ignore' });
    execSync(`git commit -m "${COMMIT_MESSAGE.replace(/"/g, '\\"')}"`, { stdio: 'ignore' });
    process.stdout.write('[auto-commit] committed changes\n');
  } catch (_) {
    process.stdout.write('[auto-commit] commit skipped or failed\n');
  }
}

function scheduleCommit() {
  pending = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(tryCommit, DEBOUNCE_MS);
}

function safeWatchFile(filePath) {
  try {
    fs.watch(filePath, { persistent: true }, scheduleCommit);
  } catch (_) {
    // ignore watch errors for missing files
  }
}

function safeWatchDir(dirPath) {
  try {
    fs.watch(dirPath, { recursive: true, persistent: true }, scheduleCommit);
  } catch (_) {
    // ignore watch errors for missing dirs
  }
}

WATCH_DIRS.forEach((dir) => safeWatchDir(path.resolve(process.cwd(), dir)));
WATCH_FILES.forEach((file) => safeWatchFile(path.resolve(process.cwd(), file)));

process.stdout.write(`[auto-commit] watching for changes (debounce ${DEBOUNCE_MS}ms)...\n`);
