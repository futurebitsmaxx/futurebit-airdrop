// GitHub Contents API — used as a serverless database for registrations.
// Required env vars: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO
// Falls back to local filesystem when env vars are not set.

import fs from 'fs';
import path from 'path';

const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_OWNER = process.env.GITHUB_OWNER;
const GH_REPO  = process.env.GITHUB_REPO ?? 'futurebit-data';
const GH_API   = 'https://api.github.com';

export function isGitHubConfigured(): boolean {
  return !!(GH_TOKEN && GH_OWNER);
}

// ── Path traversal guard ──────────────────────────────────────────────────────
const ALLOWED_FILES = new Set(['registrations.json', 'comp-registrations.json', 'vault-registrations.json']);

function safeFilePath(filePath: string): string {
  if (!ALLOWED_FILES.has(filePath)) {
    throw new Error(`Disallowed file path: ${filePath}`);
  }
  return filePath;
}

// ── GitHub helpers ────────────────────────────────────────────────────────────

interface GHFile {
  sha:     string;
  content: string;  // base64
}

async function ghGet(filePath: string): Promise<GHFile | null> {
  const res = await fetch(
    `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept:        'application/vnd.github+json',
      },
      cache: 'no-store',
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${filePath} failed: ${res.status}`);

  // Guard against non-JSON response (e.g. GitHub HTML error page)
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('json')) throw new Error(`GitHub GET returned non-JSON: ${ct}`);

  return res.json() as Promise<GHFile>;
}

async function ghPut(filePath: string, content: string, sha?: string): Promise<void> {
  const body: Record<string, unknown> = {
    message: `update ${filePath}`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization:  `Bearer ${GH_TOKEN}`,
        Accept:         'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`GitHub PUT ${filePath} failed: ${res.status}`);
}

// ── Local filesystem fallback ─────────────────────────────────────────────────

function localPath(filePath: string): string {
  // safeFilePath already validated — just join
  return path.join(process.cwd(), 'data', filePath);
}

function localRead(filePath: string): unknown[] {
  try {
    const p = localPath(filePath);
    if (!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function localWrite(filePath: string, data: unknown[]): void {
  const p = localPath(filePath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Decode GitHub file content safely ────────────────────────────────────────
function decodeGHContent(file: GHFile): unknown[] {
  try {
    // GitHub paginates large files with \n in base64
    const b64 = file.content.replace(/\n/g, '');
    const raw  = Buffer.from(b64, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function readAll(filePath: string): Promise<unknown[]> {
  safeFilePath(filePath);
  if (isGitHubConfigured()) {
    const file = await ghGet(filePath);
    if (!file) return [];
    return decodeGHContent(file);
  }
  return localRead(filePath);
}

// Appends entry to the JSON array stored at filePath, deduplicating by dedupKey.
// Retries once on GitHub SHA conflict (concurrent writes).
export async function appendEntry(
  filePath: string,
  entry: unknown,
  dedupKey: string
): Promise<void> {
  safeFilePath(filePath);

  if (isGitHubConfigured()) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const file = await ghGet(filePath);
      const arr  = file ? decodeGHContent(file) : [];
      const sha  = file?.sha;

      const key = (entry as Record<string, unknown>)[dedupKey];
      if (arr.some(r => (r as Record<string, unknown>)[dedupKey] === key)) return;

      arr.push({ ...(entry as object), serverSavedAt: new Date().toISOString() });

      try {
        await ghPut(filePath, JSON.stringify(arr, null, 2), sha);
        return;
      } catch (err) {
        if (attempt === 1) throw new Error(`GitHub storage write failed: ${String(err)}`);
        // Retry once — concurrent write caused SHA mismatch
      }
    }
    return;
  }

  // Local fallback
  const arr = localRead(filePath);
  const key = (entry as Record<string, unknown>)[dedupKey];
  if (arr.some(r => (r as Record<string, unknown>)[dedupKey] === key)) return;
  arr.push({ ...(entry as object), serverSavedAt: new Date().toISOString() });
  localWrite(filePath, arr);
}
