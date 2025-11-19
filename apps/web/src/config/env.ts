import { z } from 'zod/v4';

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
});

const validateEnv = () => {
    const parsed = envSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NODE_ENV: process.env.NODE_ENV,
    });

    if (!parsed.success) {
        console.error('Environment variable validation failed:', parsed.error);
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
};

export const config = validateEnv();

export type EnvType = z.infer<typeof envSchema>;
