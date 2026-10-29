// Rodar com: node lib/noise.test.mjs
import assert from "node:assert/strict";
import { fillNoise } from "./noise.ts";

const make = (type) => {
  const data = new Float32Array(100_000);
  fillNoise(data, type);
  return data;
};
// média da variação entre amostras vizinhas: alta = muito agudo, baixa = grave
const roughness = (d) => {
  let sum = 0;
  for (let i = 1; i < d.length; i++) sum += Math.abs(d[i] - d[i - 1]);
  return sum / (d.length - 1);
};

for (const type of ["white", "brown"]) {
  const d = make(type);
  assert.ok(d.every((v) => v >= -1 && v <= 1), `${type}: valores fora de [-1, 1]`);
  assert.ok(d.some((v) => Math.abs(v) > 0.05), `${type}: buffer ficou em silêncio`);
}
assert.ok(
  roughness(make("brown")) < roughness(make("white")) / 3,
  "ruído marrom deve ser bem mais grave que o branco",
);

console.log("noise: ok");
