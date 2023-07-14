import { type Messenger } from "@prisma/client";

export type MessengerRow = Pick<Messenger, "username" | "password">;

export function readRowsFromFile(fileContent: string) {
  const rows = fileContent.split("\n").slice(1); // Skip the header row
  const parsedRows: MessengerRow[] = [];

  for (const row of rows) {
    const [username, password] = row.split(",");
    parsedRows.push({ username: username ?? "", password: password ?? "" });
  }

  return parsedRows.filter(({ username, password }) => username && password);
}
