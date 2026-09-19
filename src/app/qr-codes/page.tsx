import QRCode from "qrcode";
import { SITE_URL } from "@/lib/site";

const TABLE_COUNT = 15;

export default async function QrCodesPage() {
  const tables = await Promise.all(
    Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map(async (tableNumber) => {
      const url = `${SITE_URL}/tafel/${tableNumber}`;
      const qrDataUrl = await QRCode.toDataURL(url, { width: 300, margin: 1 });
      return { tableNumber, url, qrDataUrl };
    })
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-xl font-bold text-stone-900">QR-codes voor de tafels</h1>
          <p className="text-sm text-stone-500">
            Basis-URL: <code className="rounded bg-stone-100 px-1">{SITE_URL}</code>
          </p>
        </div>
        <a
          href="#"
          className="rounded-full bg-amber-800 px-5 py-2 font-semibold text-white"
          id="print-link"
        >
          Afdrukken
        </a>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 print:grid-cols-2">
        {tables.map((table) => (
          <div
            key={table.tableNumber}
            className="flex flex-col items-center rounded-xl border border-stone-200 p-6 text-center print:break-inside-avoid print:border-2"
          >
            <h2 className="mb-2 text-2xl font-bold text-amber-900">Tafel {table.tableNumber}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={table.qrDataUrl} alt={`QR-code tafel ${table.tableNumber}`} width={200} height={200} />
            <p className="mt-2 text-sm text-stone-500">Scan om te bestellen</p>
          </div>
        ))}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `document.getElementById('print-link').addEventListener('click', function(e) { e.preventDefault(); window.print(); });`,
        }}
      />
    </div>
  );
}
