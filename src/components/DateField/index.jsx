import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import "./style.css";

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function paraData(valorIso) {
  if (!valorIso) return null;
  const [y, m, d] = valorIso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function paraIso(data) {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatarBr(valorIso) {
  const [y, m, d] = valorIso.split("-");
  return `${d}/${m}/${y}`;
}

function construirSemanas(ano, mes) {
  const primeiroDoMes = new Date(ano, mes, 1);
  const offset = primeiroDoMes.getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasNoMesAnterior = new Date(ano, mes, 0).getDate();

  const anteriores = Array.from({ length: offset }, (_, idx) => ({
    data: new Date(ano, mes - 1, diasNoMesAnterior - offset + 1 + idx),
    fora: true,
  }));
  const doMes = Array.from({ length: diasNoMes }, (_, idx) => ({
    data: new Date(ano, mes, idx + 1),
    fora: false,
  }));
  const celulas = [...anteriores, ...doMes];
  while (celulas.length % 7 !== 0) {
    const ultima = celulas[celulas.length - 1].data;
    const proxima = new Date(ultima);
    proxima.setDate(proxima.getDate() + 1);
    celulas.push({ data: proxima, fora: true });
  }
  const semanas = [];
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7));
  return semanas;
}

export default function DateField({ value, onChange, className = "", placeholder = "dd/mm/aaaa", disabled }) {
  const [aberto, setAberto] = useState(false);
  const [posicao, setPosicao] = useState(null);
  const dataSelecionada = paraData(value);
  const [mesVisivel, setMesVisivel] = useState(() => dataSelecionada || new Date());

  const campoRef = useRef(null);
  const painelRef = useRef(null);

  useEffect(() => {
    if (aberto) {
      setMesVisivel(paraData(value) || new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;

    function posicionar() {
      const rect = campoRef.current?.getBoundingClientRect();
      if (rect) {
        setPosicao({ top: rect.bottom + 6, left: rect.left });
      }
    }
    posicionar();

    function aoClicarFora(e) {
      if (campoRef.current?.contains(e.target) || painelRef.current?.contains(e.target)) return;
      setAberto(false);
    }
    function aoRolar() {
      setAberto(false);
    }
    function aoTeclar(e) {
      if (e.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    window.addEventListener("scroll", aoRolar, true);
    window.addEventListener("resize", posicionar);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      window.removeEventListener("scroll", aoRolar, true);
      window.removeEventListener("resize", posicionar);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  function alternar() {
    if (disabled) return;
    setAberto((v) => !v);
  }

  function selecionarDia(data) {
    onChange({ target: { value: paraIso(data) } });
    setAberto(false);
  }

  function limpar(e) {
    e.stopPropagation();
    onChange({ target: { value: "" } });
    setAberto(false);
  }

  function mudarMes(delta) {
    setMesVisivel((atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1));
  }

  const semanas = construirSemanas(mesVisivel.getFullYear(), mesVisivel.getMonth());
  const hojeIso = paraIso(new Date());

  return (
    <div className={`date-field ${className}`} ref={campoRef}>
      <button type="button" className="date-field-trigger" onClick={alternar} disabled={disabled}>
        <CalendarIcon width={16} height={16} className="date-field-icon" />
        <span className={`date-field-valor ${!value ? "vazio" : ""}`}>
          {value ? formatarBr(value) : placeholder}
        </span>
      </button>

      {aberto && posicao && createPortal(
        <div className="date-field-painel" ref={painelRef} style={{ top: posicao.top, left: posicao.left }}>
          <div className="date-field-cabecalho">
            <button type="button" className="date-field-nav" onClick={() => mudarMes(-1)} aria-label="Mês anterior">
              <ChevronLeftIcon width={15} height={15} />
            </button>
            <span className="date-field-titulo">{MESES[mesVisivel.getMonth()]} de {mesVisivel.getFullYear()}</span>
            <button type="button" className="date-field-nav" onClick={() => mudarMes(1)} aria-label="Próximo mês">
              <ChevronRightIcon width={15} height={15} />
            </button>
          </div>

          <div className="date-field-semana">
            {DIAS_SEMANA.map((d) => <span key={d}>{d}</span>)}
          </div>

          <div className="date-field-grade">
            {semanas.map((semana, i) => (
              <div className="date-field-linha" key={i}>
                {semana.map((cel) => {
                  const iso = paraIso(cel.data);
                  const classes = [
                    "date-field-dia",
                    cel.fora ? "fora" : "",
                    iso === hojeIso ? "hoje" : "",
                    iso === value ? "selecionado" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <button type="button" key={iso} className={classes} onClick={() => selecionarDia(cel.data)}>
                      {cel.data.getDate()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="date-field-rodape">
            <button type="button" className="date-field-limpar" onClick={limpar}>Limpar</button>
            <button type="button" className="date-field-hoje" onClick={() => selecionarDia(new Date())}>Hoje</button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
