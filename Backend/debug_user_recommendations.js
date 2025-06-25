require("dotenv").config({ path: ".env.local" });
const { getInteractionDataServiceImproved, getAllUserVideoInteractions } = require("./src/services/video_improved.service");
const { getRecommendationsService } = require("./src/services/recommendation.service");
const Video = require("./src/models/video.model");
const mongoose = require("mongoose");

async function debugMultipleUsers() {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    // Test với nhiều user IDs
    const testUserIds = [
      "681ccf3e684f3cb552b04bd6", // User 1
      "68215cf0f305a48f952f8265", // User 2  
      "682d500284e707d3d12410be", // User 3
      "6823ff449fb90ffbd3633881", // User 4
    ];

    console.log("\n=== DEBUGGING RECOMMENDATIONS FOR MULTIPLE USERS ===\n");

    for (const userId of testUserIds) {
      console.log(`\n🔍 ===== USER: ${userId} =====`);
      
      try {
        // 1. Kiểm tra interactions của user
        const userInteractions = await getAllUserVideoInteractions(userId);
        console.log(`📊 User interactions: ${userInteractions.length} videos`);
        
        if (userInteractions.length > 0) {
          console.log(`   First 3 watched videos: ${userInteractions.slice(0, 3)}`);
        } else {
          console.log(`   ⚠️  No interactions found for this user`);
        }

        // 2. Lấy recommendations
        console.log(`🤖 Getting recommendations...`);
        const startTime = Date.now();
        const recommendations = await getRecommendationsService(userId);
        const endTime = Date.now();
        
        console.log(`⏱️  Time taken: ${endTime - startTime}ms`);
        console.log(`📝 Message: ${recommendations.message}`);
        console.log(`📊 Total videos returned: ${recommendations.data.videos.length}`);
        
        // 3. Phân tích top 5 recommendations
        const topVideos = recommendations.data.videos.slice(0, 5);
        console.log(`🔥 Top 5 recommendations:`);
        topVideos.forEach((video, index) => {
          console.log(`   ${index + 1}. "${video.title}" (Rating: ${video.predicted_rating || 0}, Top: ${video.is_top_recommended || false})`);
        });

        // 4. Kiểm tra xem có video đã xem không
        const watchedInRecommendations = recommendations.data.videos.filter(video => {
          return userInteractions.includes(video._id.toString());
        });
        
        if (watchedInRecommendations.length > 0) {
          console.log(`❌ ERROR: Found ${watchedInRecommendations.length} already watched videos in recommendations!`);
          watchedInRecommendations.forEach(video => {
            console.log(`   - "${video.title}" (ID: ${video._id})`);
          });
        } else {
          console.log(`✅ Good: No watched videos in recommendations`);
        }

      } catch (error) {
        console.log(`❌ Error for user ${userId}:`, error.message);
      }
    }

    // 5. So sánh recommendations giữa các users
    console.log(`\n🔄 ===== COMPARING RECOMMENDATIONS =====`);
    
    const allRecommendations = {};
    for (const userId of testUserIds) {
      try {
        const recs = await getRecommendationsService(userId);
        allRecommendations[userId] = recs.data.videos.slice(0, 5).map(v => ({
          id: v._id.toString(),
          title: v.title,
          rating: v.predicted_rating || 0
        }));
      } catch (error) {
        console.log(`Error getting recommendations for ${userId}: ${error.message}`);
        allRecommendations[userId] = [];
      }
    }

    // Check if recommendations are identical
    const userIds = Object.keys(allRecommendations);
    let identicalPairs = [];
    
    for (let i = 0; i < userIds.length; i++) {
      for (let j = i + 1; j < userIds.length; j++) {
        const user1 = userIds[i];
        const user2 = userIds[j];
        const recs1 = allRecommendations[user1];
        const recs2 = allRecommendations[user2];
        
        const identical = recs1.length === recs2.length && 
          recs1.every((video, index) => video.id === recs2[index]?.id);
        
        if (identical) {
          identicalPairs.push([user1, user2]);
        }
      }
    }

    if (identicalPairs.length > 0) {
      console.log(`❌ PROBLEM: Found ${identicalPairs.length} pairs with identical recommendations:`);
      identicalPairs.forEach(([user1, user2]) => {
        console.log(`   - ${user1} and ${user2} have identical recommendations`);
      });
    } else {
      console.log(`✅ Good: All users have different recommendations`);
    }

    // 6. Chi tiết so sánh top 3 videos của mỗi user
    console.log(`\n📋 ===== TOP 3 VIDEOS PER USER =====`);
    userIds.forEach(userId => {
      console.log(`User ${userId}:`);
      const top3 = allRecommendations[userId].slice(0, 3);
      top3.forEach((video, i) => {
        console.log(`   ${i+1}. ${video.title} (Rating: ${video.rating})`);
      });
      console.log();
    });

  } catch (error) {
    console.error("Debug error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

debugMultipleUsers(); 