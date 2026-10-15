export function createId(prefix: string): string {
  const rand = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}-${rand}`;
}

export function createDonationId(): string {
  return createId("DON");
}
