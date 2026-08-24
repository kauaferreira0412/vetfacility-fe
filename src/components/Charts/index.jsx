import { useBarChartContainer, useStatusBarListContainer } from "./Container";
import "./style.css";

export function BarChart({ dados, corBarra = "var(--primary-600)", formatarValor = (v) => v }) {
  const { hoverIdx, setHoverIdx, max, maiorIdx } = useBarChartContainer({ dados });

  return (
    <div className="bar-chart">
      {dados.map((d, i) => {
        const alturaPct = Math.round((d.valor / max) * 100);
        const emFoco = hoverIdx === i;
        return (
          <div
            key={d.rotulo + i}
            className="bar-col"
            tabIndex={0}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            onFocus={() => setHoverIdx(i)}
            onBlur={() => setHoverIdx(null)}
          >
            {emFoco && (
              <div className="bar-tooltip">
                <strong>{formatarValor(d.valor)}</strong>
                <span>{d.rotuloCompleto || d.rotulo}</span>
              </div>
            )}
            <div className="bar-track">
              <div
                className={`bar ${emFoco ? "hover" : ""}`}
                style={{ height: `${Math.max(alturaPct, d.valor > 0 ? 4 : 0)}%`, background: corBarra }}
              >
                {i === maiorIdx && d.valor > 0 && <span className="bar-value">{formatarValor(d.valor)}</span>}
              </div>
            </div>
            <span className="bar-axis-label">{d.rotulo}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StatusBarList({ itens }) {
  const { max } = useStatusBarListContainer({ itens });
  return (
    <div className="status-bars">
      {itens.map((item) => (
        <div className="status-bar-row" key={item.rotulo}>
          <span className="status-bar-label">{item.rotulo}</span>
          <div className="status-bar-track">
            <div
              className="status-bar-fill"
              style={{ width: `${Math.max(Math.round((item.valor / max) * 100), item.valor > 0 ? 4 : 0)}%`, background: item.cor }}
            />
          </div>
          <span className="status-bar-value">{item.valor}</span>
        </div>
      ))}
    </div>
  );
}
