import { jsonError, requireUser } from "@/lib/http";
import { buildSimplePdf } from "@/lib/pdf";
import { getReceipt } from "@/lib/store";
import { formatBangkok } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireUser();
  if (auth.response) return auth.response;
  const { id } = await context.params;
  const receipt = getReceipt(id);
  if (!receipt) return jsonError("Receipt not found.", 404);
  if (auth.user.role === "donor" && receipt.donorId !== auth.user.id) {
    return jsonError("You do not have permission to view this receipt.", 403);
  }

  const format = new URL(request.url).searchParams.get("format") ?? "pdf";
  const lines = [
    `Receipt ${receipt.id}`,
    `Donation ${receipt.donationId}`,
    `Food type: ${receipt.foodType}`,
    `Recorded weight: ${receipt.weightKg} kg`,
    `Delivered: ${formatBangkok(receipt.timestamp)}`,
    `Emailed to: ${receipt.emailedTo} (${receipt.emailStatus})`,
  ];

  if (format === "csv") {
    const csv = ["field,value", ...lines.map((line) => `note,${JSON.stringify(line)}`)].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${receipt.id}.csv"`,
      },
    });
  }

  const pdf = buildSimplePdf("QWERTY Rescue donation receipt", lines);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${receipt.id}.pdf"`,
    },
  });
}
