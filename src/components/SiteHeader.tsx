import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-amber-900/10 bg-[#fbf6ef]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="font-heading text-lg font-semibold whitespace-nowrap text-amber-950 sm:text-xl">
          Benny&apos;s <span className="text-orange-600">Amsterdam</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-amber-950/80 sm:gap-6">
          <Link href="/" className="hidden transition hover:text-orange-600 sm:inline">
            Home
          </Link>
          <Link href="/menu" className="transition hover:text-orange-600">
            Menukaart
          </Link>
          <Link
            href="/#contact"
            className="rounded-full bg-orange-600 px-3 py-1.5 text-white transition hover:bg-orange-700 sm:px-4 sm:py-2"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
