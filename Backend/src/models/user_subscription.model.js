const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Schema = mongoose.Schema;

const userSubscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    channel_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

userSubscriptionSchema.index({ user_id: 1, channel_id: 1 });

// Thêm plugin xóa mềm
userSubscriptionSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const UserSubscription = mongoose.model(
  "UserSubscription",
  userSubscriptionSchema
);

module.exports = UserSubscription;
