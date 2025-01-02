-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "Like_likedUserId_idx" ON "Like"("likedUserId");

-- CreateIndex
CREATE INDEX "Like_userId_likedUserId_direction_idx" ON "Like"("userId", "likedUserId", "direction");

-- CreateIndex
CREATE INDEX "User_age_idx" ON "User"("age");

-- CreateIndex
CREATE INDEX "User_city_idx" ON "User"("city");

-- CreateIndex
CREATE INDEX "User_gender_idx" ON "User"("gender");

-- CreateIndex
CREATE INDEX "User_genderPreference_idx" ON "User"("genderPreference");

-- CreateIndex
CREATE INDEX "User_minAgePreference_idx" ON "User"("minAgePreference");

-- CreateIndex
CREATE INDEX "User_maxAgePreference_idx" ON "User"("maxAgePreference");
