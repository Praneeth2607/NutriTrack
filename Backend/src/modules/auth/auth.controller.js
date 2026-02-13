import * as authService from "./auth.service.js";

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const user = await authService.loginUser(req.body);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
