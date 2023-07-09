-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshTokens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'empty'
);
INSERT INTO "new_RefreshTokens" ("id", "token") SELECT "id", "token" FROM "RefreshTokens";
DROP TABLE "RefreshTokens";
ALTER TABLE "new_RefreshTokens" RENAME TO "RefreshTokens";
CREATE UNIQUE INDEX "RefreshTokens_token_key" ON "RefreshTokens"("token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
