const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");

router.post("/subscribe", subscriptionController.subscribe);
router.post("/unsubscribe", subscriptionController.unsubscribe);
router.get(
  "/subscriptions/:userId/count",
  subscriptionController.getSubscriptionCount
);
router.get(
  "/subscriptions/:userId/subscribers",
  subscriptionController.getSubscribers
);
router.get(
  "/subscriptions/:userId/getUserSubscriptions",
  subscriptionController.getUserSubscriptions
);
router.get(
  "/subscriptions/check-subscription",
  subscriptionController.checkSubscription
);
router.get(
  "/subscriptions/channel-info/:channel_id",
  subscriptionController.getChannelInfo
);

module.exports = router;
