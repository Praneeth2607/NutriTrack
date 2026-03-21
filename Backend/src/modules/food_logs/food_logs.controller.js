import * as foodLogsService from "./food_logs.service.js";

export async function addFoodLog(req, res, next) {
  try {
    const userId = req.user.id || req.user.user_id;
    const log = await foodLogsService.addFoodLog(userId, req.body);
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
}

export async function getLogsForDate(req, res, next) {
  try {
    const userId = req.user.id || req.user.user_id;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    const logs = await foodLogsService.getDailyLogs(userId, date);
    const summary = await foodLogsService.getDailySummary(userId, date);
    
    res.json({
      date,
      summary,
      logs
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteLog(req, res, next) {
  try {
    const userId = req.user.id || req.user.user_id;
    const { id } = req.params;
    
    const success = await foodLogsService.deleteFoodLog(userId, id);
    if (!success) {
      return res.status(404).json({ message: "Log not found or unauthorized" });
    }
    
    res.json({ message: "Food log deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getWeeklyLogs(req, res, next) {
  try {
    const userId = req.user.id || req.user.user_id;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    const weeklyData = await foodLogsService.getWeeklySummary(userId, date);
    res.json(weeklyData);
  } catch (err) {
    next(err);
  }
}
