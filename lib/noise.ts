// Preenche um buffer de áudio com ruído (valores em [-1, 1]).
// Marrom = ruído branco integrado (mais grave); o fator 3.5 recupera o volume perdido.
export function fillNoise(data: Float32Array, type: "white" | "brown") {
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    if (type === "white") {
      data[i] = white;
    } else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = Math.max(-1, Math.min(1, last * 3.5));
    }
  }
}
