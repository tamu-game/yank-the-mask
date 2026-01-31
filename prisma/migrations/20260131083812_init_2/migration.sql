-- CreateEnum
CREATE TYPE "GameSessionOutcome" AS ENUM ('WIN', 'LOSE');

-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "characterId" TEXT,
ADD COLUMN     "guessedAtQuestion" INTEGER,
ADD COLUMN     "outcome" "GameSessionOutcome";
