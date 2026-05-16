import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "8h",
    issuer: "maquinados-jaco-cms",
  });
}

export function verifyToken(req: NextRequest): jwt.JwtPayload {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("Token ausente");
  return jwt.verify(token, process.env.JWT_SECRET!, {
    issuer: "maquinados-jaco-cms",
  }) as jwt.JwtPayload;
}
