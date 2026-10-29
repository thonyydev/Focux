// Rodar com: node lib/stats.test.mjs
import assert from "node:assert/strict";
import { currentStreak, focusMinutesToday } from "./stats.ts";

const now = new Date(2026, 9, 29, 15, 0); // 29/out/2026 15:00
const at = (daysAgo, hour = 10) =>
  new Date(2026, 9, 29 - daysAgo, hour, 0);
const s = (daysAgo, duration = 1500, hour) => ({
  duration,
  completedAt: at(daysAgo, hour),
});

assert.equal(currentStreak([], now), 0, "sem sessões");
assert.equal(currentStreak([s(0)], now), 1, "só hoje");
assert.equal(currentStreak([s(0), s(0, 1500, 8), s(1), s(2)], now), 3, "vários no mesmo dia contam uma vez");
assert.equal(currentStreak([s(1), s(2)], now), 2, "hoje sem sessão: continua desde ontem");
assert.equal(currentStreak([s(2), s(3)], now), 0, "ontem e hoje vazios: sequência quebrou");
assert.equal(currentStreak([s(0), s(2), s(3)], now), 1, "buraco ontem corta a sequência");
// aceita Timestamp do Firestore e ignora sessão ainda sem data
assert.equal(
  currentStreak([{ duration: 60, completedAt: { toDate: () => at(0) } }, { duration: 60, completedAt: null }], now),
  1,
  "Timestamp do Firestore e completedAt nulo",
);
// virada de mês
assert.equal(
  currentStreak([{ duration: 60, completedAt: new Date(2026, 9, 1) }, { duration: 60, completedAt: new Date(2026, 8, 30) }], new Date(2026, 9, 1, 12)),
  2,
  "virada de mês",
);

assert.equal(focusMinutesToday([], now), 0);
assert.equal(focusMinutesToday([s(0, 1500), s(0, 600, 8), s(1, 1500)], now), 35, "soma só hoje, em minutos");

console.log("stats: ok");
