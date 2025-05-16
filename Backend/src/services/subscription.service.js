const User = require("../models/user.model");
const UserSubscription = require("../models/user_subscription.model");
const Video = require("../models/video.model");
const VideoStats = require("../models/video_stats.model");

const subscribe = async (userId, channelId) => {
  // Find users by their MongoDB _id
  const user = await User.findById(userId);
  const targetUser = await User.findById(channelId);

  if (!user || !targetUser) {
    throw new Error("User not found");
  }

  const existingSubscription = await UserSubscription.findOne({
    user_id: userId,
    channel_id: channelId,
  });

  if (existingSubscription) {
    throw new Error("Already subscribed");
  }

  await UserSubscription.create({ user_id: userId, channel_id: channelId });

  // Thống kê số lượng subscribe cho user
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const videos = await Video.find({ user_id: channelId });
  for (const video of videos) {
    await VideoStats.findOneAndUpdate(
      { video_id: video._id, date: today },
      { $inc: { subscriptions: 1 } },
      { upsert: true }
    );
  }
  //

  return { message: `Subscribed to ${targetUser.user_name}` };
};

const unsubscribe = async (userId, channelId) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(channelId);

  if (!user || !targetUser) {
    throw new Error("User not found");
  }

  await UserSubscription.deleteOne({ user_id: userId, channel_id: channelId });
  return { message: `Unsubscribed from ${targetUser.user_name}` };
};

const getSubscriptionCount = async (channelId) => {
  const targetUser = await User.findById(channelId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  const count = await UserSubscription.countDocuments({
    channel_id: channelId,
  });
  return {
    userId: channelId,
    userName: targetUser.user_name,
    subscriptionCount: count,
  };
};

const getSubscribers = async (channelId) => {
  const targetUser = await User.findById(channelId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  const subscriptions = await UserSubscription.find({
    channel_id: channelId,
  }).populate("user_id", "_id user_name");

  const subscribers = subscriptions.map((sub) => ({
    userId: sub.user_id._id,
    userName: sub.user_id.user_name,
  }));

  return { userId: channelId, userName: targetUser.user_name, subscribers };
};
const getUserSubscriptions = async (userId) => {
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  const subscriptions = await UserSubscription.find({
    user_id: userId,
  }).populate("channel_id", "_id user_name");

  const channels = subscriptions.map((sub) => ({
    channelId: sub.channel_id._id,
    channelName: sub.channel_id.user_name,
  }));

  return {
    userId,
    userName: targetUser.user_name,
    channels,
  };
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscriptionCount,
  getSubscribers,
  getUserSubscriptions,
};
