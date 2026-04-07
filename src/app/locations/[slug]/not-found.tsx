import Link from "next/link";

export default function LocationNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-pp-olive px-6 text-center text-pp-creme">
      <p className="font-display text-2xl">Locatie niet gevonden</p>
      <p className="font-accent mt-3 max-w-sm text-sm text-pp-creme/70">
        Deze vestiging bestaat (nog) niet in onze lijst.
      </p>
      <Link
        href="/locations"
        className="font-accent mt-8 rounded-sm border border-pp-creme/40 px-5 py-3 text-[0.62rem] tracking-[0.24em] uppercase transition-colors hover:border-pp-lollypop hover:text-pp-lollypop"
      >
        Alle locaties
      </Link>
    </div>
  );
}
