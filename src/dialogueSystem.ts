import * as os from 'os';

export interface DialogueEntry {
  text: string;
  animation?: 'idle' | 'panic' | 'celebrate' | 'sleep' | 'inspect';
  particleEffect?: 'sparkles' | 'zzz';
}

function username(): string {
  try { return os.userInfo().username; } catch { return 'friend'; }
}

export function getLines(): DialogueEntry[] {
  const name = username();
  return [
    // ── Classic Rocky lines ─────────────────────────────────────────────
    { text: "How do you know when the hug is done?" },
    { text: "Thumbs up, baby", particleEffect: 'sparkles' },
    { text: "Rocky hate Mark." },
    { text: "Fist my bump." },
    { text: `${name} question is dumb` },
    { text: "Only us" },
    { text: "My portable Earth thinking machine" },
    { text: `Rocky, ${name}, big science`, animation: 'celebrate', particleEffect: 'sparkles' },
    { text: "I go home six years slow", animation: 'sleep' },
    { text: "Oh, humor. Confusing." },
    { text: "Dirty, dirty, dirty…. This room for garbage?", animation: 'panic' },
    { text: "It's not enough" },
    { text: "Need word: to risk self to help another", animation: 'inspect' },
    { text: "Amaze. Amaze. Amaze.", animation: 'celebrate', particleEffect: 'sparkles' },
    { text: `${name} Rocky Save Stars`, animation: 'celebrate', particleEffect: 'sparkles' },
    { text: "Words of encouragement." },
    { text: "Words of GREAT encouragement", animation: 'celebrate' },
    { text: "Rocky new to ball" },
    { text: "It's full good", particleEffect: 'sparkles' },
    { text: "Dirty. Dirty. Dirty.", animation: 'panic' },
    { text: "Where my bedroooom", animation: 'sleep', particleEffect: 'zzz' },

    // ── New Rocky lines ─────────────────────────────────────────────────
    { text: `${name} will die question?`, animation: 'inspect' },
    { text: `Rocky watch whole crew die. Rocky not fix. ${name} say ${name} will die. Rocky fix.`, animation: 'inspect' },
    { text: "You sleep. I watch." },
    { text: `Friend ${name}.`, particleEffect: 'sparkles' },
    { text: "Question?", animation: 'inspect' },
    { text: "Good. Good. Good.", particleEffect: 'sparkles' },
    { text: "You are scary space monster. But okay." },
    { text: `${name}. Clever. Amaze.`, animation: 'celebrate', particleEffect: 'sparkles' },

    // ── Code-related Rocky-inspired lines ───────────────────────────────
    { text: "Code working. Question?", animation: 'inspect' },
    { text: "Bug. Bug. Bug. Rocky see.", animation: 'panic' },
    { text: "Tests pass. Big science.", animation: 'celebrate', particleEffect: 'sparkles' },
    { text: `Function clever. Like ${name}.` },
    { text: "Compile success. Amaze.", animation: 'celebrate', particleEffect: 'sparkles' },
    { text: "Merge conflict. Dirty. Dirty.", animation: 'panic' },
    { text: "Push to main? Question?", animation: 'inspect' },
    { text: `${name} code amaze.`, animation: 'celebrate', particleEffect: 'sparkles' },
    { text: "Refactor. Cleaner. Good." },
    { text: "Loop infinite. Rocky scared.", animation: 'panic' },
    { text: "Null pointer. Null pointer. Why.", animation: 'panic' },
    { text: "Stack overflow. Question?", animation: 'inspect' },
    { text: "TypeScript. Confusing. But okay." },
    { text: "Async. Await. Patience." },
    { text: "Memory leak. Plug hole. Plug hole.", animation: 'panic' },
    { text: "Git push good. Fist my bump.", animation: 'celebrate', particleEffect: 'sparkles' },
    { text: "Console log? Show Rocky.", animation: 'inspect' },
    { text: "Syntax error. Fix. Fix.", animation: 'panic' },
    { text: "Pull request. Words of encouragement." },
    { text: "Deploy success. Big science.", animation: 'celebrate', particleEffect: 'sparkles' },
    { text: "Code clean. Rocky proud.", particleEffect: 'sparkles' },
    { text: "Variable name dumb. Rocky rename." },
    { text: "Code review. Only us." },
    { text: `Rocky watch code die. Could not fix. ${name} say ${name} will fix. ${name} fix.`, animation: 'celebrate' },
  ];
}
