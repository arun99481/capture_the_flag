-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "clerkId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "registration_start_time" TIMESTAMP(3) NOT NULL,
    "registration_end_time" TIMESTAMP(3) NOT NULL,
    "event_start_time" TIMESTAMP(3) NOT NULL,
    "event_end_time" TIMESTAMP(3) NOT NULL,
    "max_teams" INTEGER,
    "min_team_size" INTEGER NOT NULL DEFAULT 1,
    "max_team_size" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "system_prompt" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "hint1" TEXT,
    "hint2" TEXT,
    "hint3" TEXT,
    "hint1_penalty" INTEGER,
    "hint2_penalty" INTEGER,
    "hint3_penalty" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "join_code" TEXT NOT NULL,
    "leader_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamProgress" (
    "team_id" TEXT NOT NULL,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "last_update_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamProgress_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "ChallengeInteraction" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "solved_at" TIMESTAMP(3),
    "input" TEXT,
    "response" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hint_usage" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "hint_number" INTEGER NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hint_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_join_code_key" ON "Team"("join_code");

-- CreateIndex
CREATE UNIQUE INDEX "Team_event_id_name_key" ON "Team"("event_id", "name");

-- CreateIndex
CREATE INDEX "TeamMember_user_id_idx" ON "TeamMember"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_user_id_team_id_key" ON "TeamMember"("user_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "hint_usage_team_id_challenge_id_hint_number_key" ON "hint_usage"("team_id", "challenge_id", "hint_number");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leader_user_id_fkey" FOREIGN KEY ("leader_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamProgress" ADD CONSTRAINT "TeamProgress_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeInteraction" ADD CONSTRAINT "ChallengeInteraction_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeInteraction" ADD CONSTRAINT "ChallengeInteraction_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hint_usage" ADD CONSTRAINT "hint_usage_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hint_usage" ADD CONSTRAINT "hint_usage_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
