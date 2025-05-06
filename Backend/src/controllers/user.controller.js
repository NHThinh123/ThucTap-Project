const {
  getListUserService,
  helloUserService,
} = require("../services/user.service");

const getListUser = async (req, res, next) => {
  try {
    const data = await getListUserService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const helloUser = async (req, res, next) => {
  try {
    const data = await helloUserService();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  helloUser,
  getListUser,
};
