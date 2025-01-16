import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import type { User, Session } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, user_id: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    user_id,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  };
  await prisma.session.create({
    data: session
  });

	const cookieStore = await cookies();
	cookieStore.set("session", sessionId, {
		httpOnly: true,
		secure: true,
		expires: session.expires_at,
		sameSite: "lax",
		path: "/",
	})

	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const result = await prisma.session.findUnique({
		where: {
			id: token
		},
		include: {
			user: true
		}
	});
	if (result === null) {
		return { session: null, user: null };
	}
	const { user, ...session } = result;
	if (Date.now() >= session.expires_at.getTime()) {
		await prisma.session.delete({ where: { id: token } });
		return { session: null, user: null };
	}
	if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				expires_at: session.expires_at
			}
		});
	}
	
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({ where: { id: sessionId } });
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };