import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const dataDir = process.env.PGLITE_DATA_DIR ?? "./.pglite-data";
const port = Number(process.env.PGLITE_PORT ?? 5432);

const db = new PGlite(dataDir);
const server = new PGLiteSocketServer({ db, port, host: "127.0.0.1" });

await server.start();
console.log(`PGlite dev database listening on postgresql://127.0.0.1:${port}`);
