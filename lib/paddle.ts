import type { Paddle, PaddleEventData } from "@paddle/paddle-js";
import type { Paddle as PaddleNode } from "@paddle/paddle-node-sdk";

export type PaddleEnvironment = "sandbox" | "production";

/** Checkout lifecycle events passed to the client `eventCallback`. */
export type PaddleCheckoutEvent = Pick<PaddleEventData, "name" | "data">;

/**
 * Paddle reports its environment as "sandbox" or "production". Anything else
 * (including an unset value) falls back to sandbox so misconfiguration never
 * accidentally charges real customers.
 */
export function resolvePaddleEnvironment(value: string | undefined): PaddleEnvironment {
  return value === "production" ? "production" : "sandbox";
}

/**
 * Initializes Paddle.js in the browser. The client token is public by design and
 * must be exposed as NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.
 */
export async function getPaddleClient(options?: {
  eventCallback?: (event: PaddleCheckoutEvent) => void;
}): Promise<Paddle | undefined> {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    throw new Error("Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN environment variable.");
  }

  const { initializePaddle } = await import("@paddle/paddle-js");

  return initializePaddle({
    token,
    environment: resolvePaddleEnvironment(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT),
    eventCallback: options?.eventCallback,
  });
}

/**
 * Initializes the Paddle Node SDK for server-side calls and webhook
 * verification. The API key must never be exposed to the client.
 */
export async function getPaddleServerClient(): Promise<PaddleNode> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing PADDLE_API_KEY environment variable.");
  }

  const { Paddle, Environment } = await import("@paddle/paddle-node-sdk");

  return new Paddle(apiKey, {
    environment:
      resolvePaddleEnvironment(process.env.PADDLE_ENVIRONMENT) === "production"
        ? Environment.production
        : Environment.sandbox,
  });
}
