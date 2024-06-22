import { drizzle } from 'npm:drizzle-orm/postgres-js';
import postgres from 'npm:postgres';
import { DatabaseConnection } from "./type.ts";


export function createDatabaseConnection(): DatabaseConnection {
  return drizzle(
    postgres(
        'postgresql://postgres:Wkmp778899@localhost:5432/sectask',
    ),
  );
}
