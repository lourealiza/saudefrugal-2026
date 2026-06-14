const phrases = [
  "Alimentação natural",
  "Jejum higienista",
  "Dieta anticâncer",
  "Saúde sem remédios",
  "Medicina do estilo de vida",
];

export default function Marquee() {
  const loop = [...phrases, ...phrases];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        <span>
          {loop.map((p, i) => (
            <span key={i}>{p}</span>
          ))}
        </span>
        <span>
          {loop.map((p, i) => (
            <span key={`b-${i}`}>{p}</span>
          ))}
        </span>
      </div>
    </div>
  );
}
