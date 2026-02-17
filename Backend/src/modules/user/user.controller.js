import * as userService from "./user.service.js";

export async function getProfile(req, res, next) {
  try {
    const profile = await userService.getUserProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
