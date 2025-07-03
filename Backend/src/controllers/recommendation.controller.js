const {
  getRecommendationsService,
} = require("../services/recommendation.service");

function fixVideoUrl(video, req) {
  if (!video) return video;
  const protocol = req.protocol;
  const host = req.headers.host;
  if (video.video_url && video.video_url.includes('localhost')) {
    video.video_url = video.video_url.replace(
      /http:\/\/localhost:\d+/,
      `${protocol}://${host}`
    );
  }
  if (video.thumbnail_video && video.thumbnail_video.includes('localhost')) {
    video.thumbnail_video = video.thumbnail_video.replace(
      /http:\/\/localhost:\d+/,
      `${protocol}://${host}`
    );
  }
  return video;
}

const getRecommendations = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    console.log(
      `Lấy đề xuất cho user_id: ${user_id || "người dùng đăng xuất"}`
    );
    const result = await getRecommendationsService(user_id || null);
    if (result?.data?.videos) {
      result.data.videos = result.data.videos.map(video => fixVideoUrl(video, req));
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
