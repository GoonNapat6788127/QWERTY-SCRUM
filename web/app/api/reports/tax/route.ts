import { jsonError, requireUser } from "@/lib/http";
import { buildSimplePdf } from "@/lib/pdf";
import { listReceipts } from "@/lib/store";
import { formatBangkok } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireUser(["donor", "logistics"]);
  if (auth.response) return auth.response;
  const url = new URL(request.url);
  const month = url.searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
  const format = url.searchParams.get("format") ?? "csv";
  const receipts = (auth.user.role === "donor" ? listReceipts(auth.user.id) : listReceipts()).filter(
    (item) => item.timestamp.slice(0, 7) === month,
  );

  if (format === "pdf") {
    const lines = [
      `Month: ${month}`,
      `Receipts: ${receipts.length}`,
      ...receipts.map(
        (item) =>
          `${item.id} | ${item.foodType} | ${item.weightKg} kg | ${formatBangkok(item.timestamp)}`,
      ),
    ];
    const pdf = buildSimplePdf("QWERTY Rescue monthly tax summary", lines);
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tax-summary-${month}.pdf"`,
      },
    });
  }

  const rows = [
    "receiptId,donationId,foodType,weightKg,timestamp,emailedTo",
    ...receipts.map(
      (item) =>
        [item.id, item.donationId, item.foodType, item.weightKg, item.timestamp, item.emailedTo]
          .map((value) => JSON.stringify(String(value)))
          .join(","),
    ),
  ];
  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="tax-summary-${month}.csv"`,
    },
  });
}

export function POST() {
  return jsonError("Use GET with month and format query params.", 405);
}
