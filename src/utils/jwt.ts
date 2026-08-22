import "dotenv/config";
import jwt from "jsonwebtoken";

export type JwtPayload = {
    userId: number;
    role: string;
    businessId: number | null;
};

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in .env");
    }

    return secret;
}

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: "7d",
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(
        token,
        getJwtSecret()
    ) as JwtPayload;
}