import type { UserPayload } from "../utils/jwt.js";

declare global {
    namespace Express {
        interface Request {
            user: UserPayload;
        }
    }
}

export {};

declare namespace Express {
  export interface Request {
    user?: {
      userId: number;
      role: string;
      businessId: number | null;
    };
  }
}