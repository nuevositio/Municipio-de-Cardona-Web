import 'dotenv/config';
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    FRONTEND_ORIGIN: string;
    SESSION_SECRET: string;
    DATABASE_URL: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    CLOUDFLARE_TURNSTILE_SECRET: string;
    OPENAI_API_KEY: string;
    DIRECT_URL?: string | undefined;
    SUPERADMIN_USERNAME?: string | undefined;
    SUPERADMIN_EMAIL?: string | undefined;
    SUPERADMIN_PASSWORD?: string | undefined;
};
