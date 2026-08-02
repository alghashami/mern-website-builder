const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const sectionController = require('../controllers/sectionController');

// رفع صورة الغلاف (واحدة) - إضافة قسم جديد
router.post('/', upload.single('coverImage'), sectionController.createSection);

// جلب جميع الأقسام
router.get('/', sectionController.getAllSections);

// جلب قسم واحد بواسطة ID
router.get('/:id', sectionController.getSectionById);

// تحديث محتوى الصفحة الفرعية (العناوين، التفاصيل، صور المعرض)
router.put('/:id/subpage', upload.array('galleryImages', 10), sectionController.updateSubPage);

// حذف قسم
router.delete('/:id', sectionController.deleteSection);

// تحديث معلومات القسم الأساسية (العنوان وصورة الغلاف)
router.put('/:id', upload.single('coverImage'), sectionController.updateSection);

module.exports = router;