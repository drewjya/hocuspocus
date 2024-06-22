import { createCollaborationServer } from './database/create_collaboration_server.ts';
import { createDatabaseConnection } from './database/create_database_connection.ts';

async function main() {
  const dbConn = createDatabaseConnection();
  const server = createCollaborationServer({
    database: dbConn,
    serverName: 'collab-server',
    serverPort: 3100,
    updateDebounce: 3000,
    maxDebounceTime: 5000,
  });

  await server.listen();
  console.log('Server is running on port 3100');
}

main();
