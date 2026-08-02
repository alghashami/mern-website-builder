const express = require('express');
const router = express.Router();
const { 
  getProject, 
  createProject,
  getProjectBySlug,
  updateProject, 
  publishProject, 
  unpublishProject 
} = require('../controllers/projectController');

// Routes الخاصة بلوحة التحكم
router.get('/', getProject);
router.put('/', updateProject);
router.put('/publish', publishProject);
router.put('/unpublish', unpublishProject);

// Routes الخاصة بإنشاء مشروع جديد والعرض العام
router.post('/', createProject);
router.get('/site/:projectId', getProjectBySlug);

module.exports = router;