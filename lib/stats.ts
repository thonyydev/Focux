// completedAt vem como Timestamp do Firestore; fica nulo enquanto a escrita não é confirmada
type SessionLike = {
  duration: number;
  completedAt?: { toDate: () => Date } | Date | string | number | null;
};

function sessionDate(s: SessionLike): Date | null {
  const t = s.completedAt;
  if (!t) return null;
  if (t instanceof Date) return t;
  return typeof t === "object" ? t.toDate() : new Date(t);
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function focusMinutesToday(sessions: SessionLike[], now = new Date()) {
  const today = dayKey(now);
  return sessions.reduce((acc, s) => {
    const d = sessionDate(s);
    return d && dayKey(d) === today ? acc + s.duration / 60 : acc;
  }, 0);
}

// Dias seguidos com foco até hoje. Se hoje ainda não teve sessão, a sequência
// continua viva a partir de ontem (o dia ainda não acabou).
// shortcut: só vê as sessões carregadas (as 100 mais recentes), então sequências
// muito longas ficam subcontadas; guardar um contador no documento do usuário se importar.
export function currentStreak(sessions: SessionLike[], now = new Date()) {
  const days = new Set<string>();
  for (const s of sessions) {
    const d = sessionDate(s);
    if (d) days.add(dayKey(d));
  }

  const day = new Date(now);
  if (!days.has(dayKey(day))) day.setDate(day.getDate() - 1);

  let streak = 0;
  while (days.has(dayKey(day))) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}
