import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

const OPENINGSTIJDEN = [
  { dag: "Maandag", tijd: "08:00 - 18:00" },
  { dag: "Dinsdag", tijd: "08:00 - 18:00" },
  { dag: "Woensdag", tijd: "08:00 - 18:00" },
  { dag: "Donderdag", tijd: "08:00 - 18:00" },
  { dag: "Vrijdag", tijd: "08:00 - 18:00" },
  { dag: "Zaterdag", tijd: "08:00 - 18:00" },
  { dag: "Zondag", tijd: "08:00 - 18:00" },
];

const KENMERKEN = [
  {
    titel: "Vers & huisgemaakt",
    tekst: "Elke dag vers bereid — van belegde broodjes tot smoothies.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2m6.36.64-1.41 1.41M21 12h-2M4.64 4.64 6.05 6.05M3 12h2m2.64 6.36 1.41-1.41M12 19v2m6.36-.64-1.41-1.41M17.66 6.34a5.66 5.66 0 1 1-8.01 0"
      />
    ),
  },
  {
    titel: "Marokkaanse specialiteiten",
    tekst: "Msemen, harira en andere traditionele gerechten naast bekende klassiekers.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12h16M4 12a8 8 0 0 1 16 0M4 12a8 8 0 0 0 16 0M9 16h6"
      />
    ),
  },
  {
    titel: "Gezellige buurtplek",
    tekst: "Middenin Amsterdam-Noord — ideaal voor ontbijt, lunch of een kop koffie.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c-4.5-3.5-7-6.9-7-10.2C5 6.6 8.1 3.5 12 3.5s7 3.1 7 7.3c0 3.3-2.5 6.7-7 10.2Z"
      />
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <section className="relative overflow-hidden bg-gradient-to-b from-orange-100 via-[#fbf6ef] to-[#fbf6ef] px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-600">
            Amsterdam-Noord
          </p>
          <h1 className="font-heading text-5xl font-semibold leading-tight text-amber-950 sm:text-6xl">
            Welkom bij Benny&apos;s
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg text-amber-950/70">
            Gezellige lunchroom bekend om verse broodjes, Marokkaanse specialiteiten en
            huisgemaakte smoothies.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="inline-block rounded-full bg-orange-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
            >
              Bekijk onze menukaart
            </Link>
            <Link
              href="/afhalen"
              className="inline-block rounded-full border border-amber-950/20 bg-white px-8 py-3.5 font-semibold text-amber-950 transition hover:bg-amber-50"
            >
              Bestel voor afhalen
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {KENMERKEN.map((item) => (
            <div
              key={item.titel}
              className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mb-4 h-9 w-9 text-orange-600"
              >
                {item.icon}
              </svg>
              <h3 className="font-heading text-lg font-semibold text-amber-950">{item.titel}</h3>
              <p className="mt-1.5 text-sm text-amber-950/70">{item.tekst}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-amber-950">Over ons</h2>
            <p className="mt-4 text-amber-950/70">
              Bij Benny&apos;s vind je een warme mix van traditionele Marokkaanse gerechten en
              bekende lunchroom-klassiekers — van msemen en harira tot verse broodjes,
              tosti&apos;s en smoothies. Kom gezellig langs voor ontbijt, lunch of een kop koffie.
            </p>
          </div>
          <div className="aspect-4/3 rounded-3xl bg-gradient-to-br from-orange-200 via-amber-100 to-orange-50" />
        </section>

        <section id="contact" className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-900/10 bg-white p-7">
            <h2 className="font-heading mb-4 text-xl font-semibold text-amber-950">
              Openingstijden
            </h2>
            <ul className="flex flex-col gap-1.5 text-amber-950/80">
              {OPENINGSTIJDEN.map((item) => (
                <li
                  key={item.dag}
                  className="flex justify-between border-b border-amber-900/5 py-1.5 last:border-0"
                >
                  <span>{item.dag}</span>
                  <span className="font-medium">{item.tijd}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-900/10 bg-white p-7">
            <h2 className="font-heading mb-4 text-xl font-semibold text-amber-950">
              Adres & contact
            </h2>
            <p className="text-amber-950/80">
              Waterlandplein 258
              <br />
              1024 JR Amsterdam
              <br />
              <a href="tel:0653152538" className="text-orange-600 underline">
                06 53 15 25 38
              </a>
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Waterlandplein+258+Amsterdam"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-orange-600 underline"
            >
              Bekijk op Google Maps
            </a>
            <div className="mt-5 flex gap-4 text-sm font-medium">
              <a
                href="https://www.facebook.com/www.lunchroombennys.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/bennyslunchroom/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline"
              >
                Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-amber-900/10 bg-white py-8 text-center text-sm text-amber-950/60">
        © {new Date().getFullYear()} Benny&apos;s Amsterdam — Waterlandplein 258, Amsterdam
      </footer>
    </div>
  );
}
