import { useEffect } from "react";
import { fillNoise } from "./noise";

export const AMBIENT_LABELS = {
  none: "Sem som ambiente",
  white: "Ruído branco",
  brown: "Ruído marrom",
  rain: "Chuva",
} as const;

export type Ambient = keyof typeof AMBIENT_LABELS;

export const toAmbient = (value?: string): Ambient =>
  value && value in AMBIENT_LABELS ? (value as Ambient) : "none";

// Ruído gerado na hora (sem arquivos de áudio). Chuva = ruído branco só com os agudos.
// shortcut: o loop de 2s do ruído marrom pode dar um tique leve na emenda; usar buffer maior ou crossfade se incomodar.
export function useAmbientSound(kind: Ambient, playing: boolean, volume: number) {
  useEffect(() => {
    if (kind === "none" || !playing) return;

    try {
      const ctx = new AudioContext();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      fillNoise(buffer.getChannelData(0), kind === "brown" ? "brown" : "white");

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = (volume / 100) * 0.3;

      if (kind === "rain") {
        const highpass = ctx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 1000;
        source.connect(highpass).connect(gain);
      } else {
        source.connect(gain);
      }
      gain.connect(ctx.destination);
      source.start();

      return () => {
        source.stop();
        ctx.close();
      };
    } catch (error) {
      console.error("Erro ao tocar som ambiente:", error);
    }
  }, [kind, playing, volume]);
}
