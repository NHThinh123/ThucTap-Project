const {
    subscribe: subscribeService,
    unsubscribe: unsubscribeService,
    getSubscriptionCount: getSubscriptionCountService,
    getSubscribers: getSubscribersService,
    getUserSubscriptions: getUserSubscriptionsService
  } = require('../services/subscription.service');
  
  const subscribe = async (req, res) => {
    try {
      const { userId, channelId } = req.body;
      
      if (!userId || !channelId) {
        return res.status(400).json({ 
          status: "FAILED", 
          message: "userId and channelId are required" 
        });
      }
      
      const result = await subscribeService(userId, channelId);
      return res.status(200).json({
        status: "SUCCESS",
        message: result.message
      });
    } catch (error) {
      console.error("Subscribe error:", error.message);
      return res.status(400).json({
        status: "FAILED",
        message: error.message || "Failed to subscribe"
      });
    }
  };
  
  const unsubscribe = async (req, res) => {
    try {
      const { userId, channelId } = req.body;
      
      if (!userId || !channelId) {
        return res.status(400).json({ 
          status: "FAILED", 
          message: "userId and channelId are required" 
        });
      }
      
      const result = await unsubscribeService(userId, channelId);
      return res.status(200).json({
        status: "SUCCESS",
        message: result.message
      });
    } catch (error) {
      console.error("Unsubscribe error:", error.message);
      return res.status(400).json({
        status: "FAILED",
        message: error.message || "Failed to unsubscribe"
      });
    }
  };
  
  const getSubscriptionCount = async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          status: "FAILED", 
          message: "userId is required" 
        });
      }
      
      const result = await getSubscriptionCountService(userId);
      return res.status(200).json({
        status: "SUCCESS",
        data: result
      });
    } catch (error) {
      console.error("Get subscription count error:", error.message);
      return res.status(400).json({
        status: "FAILED",
        message: error.message || "Failed to get subscription count"
      });
    }
  };
  
  const getSubscribers = async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ 
          status: "FAILED", 
          message: "userId is required" 
        });
      }
      
      const result = await getSubscribersService(userId);
      return res.status(200).json({
        status: "SUCCESS",
        data: result
      });
    } catch (error) {
      console.error("Get subscribers error:", error.message);
      return res.status(400).json({
        status: "FAILED",
        message: error.message || "Failed to get subscribers"
      });
    }
  };
  const getUserSubscriptions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra xem userId có được cung cấp không
        if (!userId) {
            return res.status(400).json({
                status: 'FAILED',
                message: 'userId is required'
            });
        }

        // Gọi hàm service để lấy danh sách channels
        const result = await getUserSubscriptionsService(userId);

        return res.status(200).json({
            status: 'SUCCESS',
            data: result
        });
    } catch (error) {
        console.error('Get user subscriptions error:', error.message);
        return res.status(400).json({
            status: 'FAILED',
            message: error.message || 'Failed to get user subscriptions'
        });
    }
};
  
  module.exports = {
    subscribe,
    unsubscribe,
    getSubscriptionCount,
    getSubscribers,
    getUserSubscriptions
  };