import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateKeyPairSync, verify as cryptoVerify } from "node:crypto";
import {
  mintTrialKey,
  SigningKeyMissingError,
  TRIAL_DAYS,
} from "../../app/lib/license";

// Generate an ephemeral Ed25519 keypair once. This is NOT the production key —
// the resulting tokens won't be accepted by the real Action, which is fine:
// these tests verify the wire format and our own signature, not Action trust.
const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const PRIVATE_PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

const ORIGINAL = process.env.LICENSE_SIGNING_KEY;

beforeEach(() => {
  process.env.LICENSE_SIGNING_KEY = PRIVATE_PEM;
});

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.LICENSE_SIGNING_KEY;
  else process.env.LICENSE_SIGNING_KEY = ORIGINAL;
});

function decodePayload(token: string) {
  const [payloadB64] = token.split(".");
  return JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
}

describe("mintTrialKey", () => {
  it("produces a <payloadB64url>.<sigB64url> token", () => {
    const { token } = mintTrialKey("you@company.com");
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1].length).toBeGreaterThan(0);
  });

  it("encodes exactly { v: 1, sub, exp } with a 14-day expiry", () => {
    const now = Math.floor(Date.now() / 1000);
    const { token, expires } = mintTrialKey("you@company.com");
    const payload = decodePayload(token);

    expect(Object.keys(payload).sort()).toEqual(["exp", "sub", "v"]);
    expect(payload.v).toBe(1);
    expect(payload.sub).toBe("you@company.com");
    expect(payload.exp).toBe(expires);

    const expected = now + TRIAL_DAYS * 86400;
    // Allow a couple of seconds of clock drift during the test run.
    expect(Math.abs(payload.exp - expected)).toBeLessThanOrEqual(2);
  });

  it("signs the base64url payload text (not the JSON) with Ed25519", () => {
    const { token } = mintTrialKey("you@company.com");
    const [payloadB64, sigB64] = token.split(".");
    const ok = cryptoVerify(
      null,
      Buffer.from(payloadB64, "ascii"),
      publicKey,
      Buffer.from(sigB64, "base64url"),
    );
    expect(ok).toBe(true);
  });

  it("honors a custom expiry length", () => {
    const now = Math.floor(Date.now() / 1000);
    const { expires } = mintTrialKey("you@company.com", 30);
    expect(Math.abs(expires - (now + 30 * 86400))).toBeLessThanOrEqual(2);
  });

  it("throws SigningKeyMissingError when the key is not configured", () => {
    delete process.env.LICENSE_SIGNING_KEY;
    expect(() => mintTrialKey("you@company.com")).toThrow(SigningKeyMissingError);
  });

  it("throws SigningKeyMissingError when the key is blank", () => {
    process.env.LICENSE_SIGNING_KEY = "   ";
    expect(() => mintTrialKey("you@company.com")).toThrow(SigningKeyMissingError);
  });
});
