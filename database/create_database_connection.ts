import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { DatabaseConnection } from './type';

export function createDatabaseConnection(): DatabaseConnection {
  return drizzle(
    postgres(
      Bun.env.DATABASE_URL ??
        'postgresql://postgres:Wkmp778899@localhost:5432/sectask',
    ),
  );
}
