import { createPrivateKey, sign as cryptoSign } from "node:crypto";

/**
 * Mints a11y-fixer-pro license keys on the server.
 *
 * The wire format here MUST stay byte-identical to the two other issuers in the
 * a11y-fixer-pro repo, or the GitHub Action will reject what we produce:
 *   - scripts/issue-license.mjs (maintainer CLI)
 *   - packages/github-action/src/license-format.test.ts (pins this exact shape)
 * and it is verified by packages/github-action/src/license.ts `verifyLicenseKey`
 * against the embedded Ed25519 public key.
 *
 * A key is `<payloadB64url>.<sigB64url>` where:
 *   - payload = base64url(JSON) of exactly `{ v: 1, sub, exp }`
 *               (schema version, subject/email, expiry in unix SECONDS)
 *   - sig     = base64url of the Ed25519 signature over the ASCII bytes of the
 *               `<payloadB64url>` segment (the base64url text, not the JSON).
 *
 * Signing requires the PRODUCTION private key — the one whose public half is
 * embedded in the Action. Set it as the LICENSE_SIGNING_KEY env var (PKCS8 PEM).
 * Any other key produces tokens the Action will not accept.
 */

/** Free trial length, in days. */
export const TRIAL_DAYS = 14;

const DAY_SECONDS = 86400;

export interface MintResult {
  token: string;
  /** Expiry as a unix timestamp (seconds). */
  expires: number;
}

/** Thrown when the signing key is not configured. Never leaks key material. */
export class SigningKeyMissingError extends Error {
  constructor() {
    super("LICENSE_SIGNING_KEY is not configured");
    this.name = "SigningKeyMissingError";
  }
}

function loadPrivateKey() {
  const pem = process.env.LICENSE_SIGNING_KEY;
  if (!pem || !pem.trim()) {
    throw new SigningKeyMissingError();
  }
  return createPrivateKey(pem);
}

/**
 * Mints a signed trial key for `sub` (an email / customer id), valid for
 * `days` days from now. Defaults to the 14-day free trial.
 */
export function mintTrialKey(sub: string, days: number = TRIAL_DAYS): MintResult {
  const privateKey = loadPrivateKey();

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + Math.round(days * DAY_SECONDS);
  const payloadB64 = Buffer.from(
    JSON.stringify({ v: 1, sub, exp }),
    "utf8",
  ).toString("base64url");
  const sig = cryptoSign(null, Buffer.from(payloadB64, "ascii"), privateKey).toString("base64url");

  return { token: `${payloadB64}.${sig}`, expires: exp };
}
