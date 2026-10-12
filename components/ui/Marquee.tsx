/** Infinite horizontal ticker. Content is duplicated so the -50% loop is seamless. */
export default function Marquee({
  items,
  reverse = false,
  slow = false,
  outline = false,
}: {
  items: string[];
  reverse?: boolean;
  slow?: boolean;
  outline?: boolean;
}) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((t) => (
        <span key={key + t} className="flex items-center">
          <span
            className={`px-6 font-display text-5xl font-semibold uppercase tracking-tight sm:text-7xl ${
              outline ? "text-transparent [-webkit-text-stroke:1px_#3a3a46]" : "text-bone"
            }`}
          >
            {t}
          </span>
          <span className="text-2xl text-acid sm:text-4xl">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap py-3">
      <div
        className={`flex w-max ${slow ? "animate-marquee-slow" : "animate-marquee"}`}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
