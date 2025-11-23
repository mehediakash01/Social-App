import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { token } = await req.json();

    const decoded = await adminAuth.verifyIdToken(token);

    return Response.json({ user: decoded, status: "success" });
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
