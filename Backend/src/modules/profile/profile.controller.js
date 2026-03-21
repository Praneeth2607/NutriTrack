import * as profileService from "./profile.service.js";

export async function getProfile(req, res, next) {
  try {
    const userId = req.user.id || req.user.user_id; // Check token payload
    const profile = await profileService.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id || req.user.user_id;
    const profile = await profileService.updateProfile(userId, req.body);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
