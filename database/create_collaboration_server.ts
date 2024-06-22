import { Database } from 'npm:@hocuspocus/extension-database';
import { Server } from 'npm:@hocuspocus/server';
import { like } from 'npm:drizzle-orm';
import { customType, pgTable, text } from 'npm:drizzle-orm/pg-core';
import type { DatabaseConnection } from './type.ts';


const byteaType = customType<{
  data: Uint8Array;
  notNull: false;
  default: false;
}>({
  dataType() {
    return 'BYTEA';
  },
});

const documentTable = pgTable('Document', {
  id: text("id").primaryKey(),
  data: byteaType('data'),
});

export function createCollaborationServer(param: {
  database: DatabaseConnection;
  serverName: string;
  serverPort: number;
  updateDebounce: number;
  maxDebounceTime: number;
}) {
  const db = param.database;

  return Server.configure({
    name: param.serverName,
    port: param.serverPort,
    debounce: param.updateDebounce,
    maxDebounce: param.maxDebounceTime,
    extensions: [
      new Database({
        async fetch(data) {


          const documentId = data.documentName;
          const rows = await db
            .select()


            .from(documentTable)
            .limit(1)
            .where(like(documentTable.id, documentId));


          if (rows && rows.length > 0) {
            return rows[0].data?.length === 0 ? null : rows[0].data;
          }
          return null

        },

        async store(data) {
          const documentId = data.documentName.toString();
          const documentData = data.state;

          await db.insert(documentTable).values({
            id: documentId,
            data: documentData,
          }).onConflictDoUpdate({
            target: documentTable.id,
            set: {
              data: documentData
            }
          })

        },
      }),
    ],

    async connected(data) {
      data.connection.requiresAuthentication = false;
    },
  });
}
