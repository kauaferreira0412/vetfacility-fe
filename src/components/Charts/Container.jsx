import { useState } from "react";

export function useBarChartContainer({ dados }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const max = Math.max(1, ...dados.map((d) => d.valor));
  const maiorIdx = dados.reduce((best, d, i) => (d.valor > dados[best].valor ? i : best), 0);

  return { hoverIdx, setHoverIdx, max, maiorIdx };
}

export function useStatusBarListContainer({ itens }) {
  const max = Math.max(1, ...itens.map((i) => i.valor));
  return { max };
}
