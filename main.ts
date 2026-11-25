// One Line, One Laugh — make.fun entry
// Writes a single funny line (1-200 chars, one line) to /output/entry.txt.
// The program scores three candidate lines against the judge's five
// published criteria (funny on its own, fast laugh, fresh angle, tight
// wording, holds up on a second read), each 0-5, and writes the winner.
// Deterministic: no network, no randomness, no secrets, no env vars
// except an overridable OUTPUT_PATH for local testing.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// [funnyOnItsOwn, fastLaugh, freshAngle, tightWording, holdsUp]
type Candidate = { text: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    // Winner: 23/25 — the punch lands on the last two words, the
    // three-paragraph apology is a specific, fresh twist on the AI-apology
    // trope, and it reads cleanly in one pass.
    text: "I asked my AI to write a one-line joke, and it apologised in three paragraphs.",
    scores: [5, 5, 4, 5, 4],
  },
  {
    // 22/25 — a fresh angle (an AI that says no in 400 words), but the
    // punch is spread across the line instead of landing at the end.
    text: "My AI assistant finally learned to say no — it just says it in 400 words and a bulleted list.",
    scores: [5, 4, 5, 4, 4],
  },
  {
    // 20/25 — a clean turn, but the meeting-about-meetings trope is familiar
    // and the laugh is slower to arrive.
    text: "I told my calendar I was busy; it booked a meeting to discuss my availability.",
    scores: [4, 4, 3, 5, 4],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

function pickWinner(candidates: Candidate[]): Candidate {
  let best = candidates[0];
  for (const c of candidates.slice(1)) {
    if (total(c) > total(best)) best = c;
  }
  return best;
}

function main(): void {
  const out = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  const winner = pickWinner(CANDIDATES);
  const text = winner.text.trim();
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${text.length}`);
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text, "utf8");
}

main();
