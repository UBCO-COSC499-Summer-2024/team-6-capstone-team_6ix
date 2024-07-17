const courseHistoryService = require('../services/courseHistory');

async function getCourseHistory(req, res) {
  try {
    const courses = await courseHistoryService.getCourseHistory(req);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

module.exports = {
  getCourseHistory
};
