import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, randomUUID } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "./lib/firebase-admin";


const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function getClientIp(req: VercelRequest): string {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0] ?? "unknown";
  }

  return req.socket.remoteAddress ?? "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;

  if (!salt) {
    throw new Error("IP_HASH_SALT is not configured");
  }

  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function isRateLimited(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  const snapshot = await db
    .collection("contactMessages")
    .where("ipHash", "==", ipHash)
    .where("createdAt", ">=", since)
    .limit(RATE_LIMIT_COUNT)
    .get();

  return snapshot.size >= RATE_LIMIT_COUNT;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const body = req.body ?? {};

    const name = normalize(body.name);
    const email = normalize(body.email).toLowerCase();
    const subject = normalize(body.subject);
    const message = normalize(body.message);

    // Honeypot field.
    // Real users should never fill this field.
    const website = normalize(body.website);

    if (website) {
      return res.status(400).json({
        error: "Invalid request",
      });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }

    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      subject.length > MAX_SUBJECT_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        error: "One or more fields are too long.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Please provide a valid email address.",
      });
    }

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);

    if (await isRateLimited(ipHash)) {
      return res.status(429).json({
        error: "Too many messages. Please try again later.",
      });
    }

    const messageId = randomUUID();

    const messageRef = db
      .collection("contactMessages")
      .doc(messageId);

    await messageRef.set({
      name,
      email,
      subject,
      message,
      createdAt: FieldValue.serverTimestamp(),
      isRead: false,
      emailSent: false,
      ipHash,
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);


    return res.status(200).json({
      success: true,
      message: "Your message has been received.",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return res.status(500).json({
      error: "Unable to process your message right now.",
    });
  }
}