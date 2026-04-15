import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';
export declare function getDb(): ReturnType<typeof drizzle<typeof schema>>;
export declare function initializeDb(): void;
export declare function closeDb(): void;
