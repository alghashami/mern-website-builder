const Section = require('../models/Section');
const fs = require('fs');
const path = require('path');

// إضافة قسم جديد
exports.createSection = async (req, res) => {
  try {
    const { title } = req.body;
    const coverImage = req.file ? req.file.path : null;
    if (!coverImage) return res.status(400).json({ msg: 'الصورة مطلوبة' });
    const newSection = new Section({ title, coverImage });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// جلب كل الأقسام
exports.getAllSections = async (req, res) => {
  const sections = await Section.find().sort({ createdAt: -1 });
  res.json(sections);
};

// جلب قسم واحد
exports.getSectionById = async (req, res) => {
  const section = await Section.findById(req.params.id);
  if (!section) return res.status(404).json({ msg: 'غير موجود' });
  res.json(section);
};

// تحديث محتوى الصفحة الفرعية (العناوين، التفاصيل، صور المعرض)
exports.updateSubPage = async (req, res) => {
  try {
    const { subHeadlines, subDetails } = req.body;
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ msg: 'غير موجود' });

    if (subHeadlines) section.subHeadlines = subHeadlines.split(',').map(s => s.trim());
    if (subDetails) section.subDetails = subDetails;
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      section.galleryImages = [...section.galleryImages, ...newImages];
    }
    
    await section.save();
    res.json(section);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// حذف قسم
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ msg: 'القسم غير موجود' });
    res.json({ msg: 'تم حذف القسم بنجاح' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// تحديث معلومات القسم الأساسية (العنوان وصورة الغلاف)
exports.updateSection = async (req, res) => {
  try {
    const { title } = req.body;
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ msg: 'القسم غير موجود' });

    // التأكد من وجود مجلد uploads
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Uploads folder created during update');
    }

    if (title) section.title = title;
    if (req.file) {
      section.coverImage = req.file.path;
    }

    await section.save();
    res.json(section);
  } catch (err) {
    console.error('Error updating section:', err);
    res.status(500).json({ error: err.message });
  }
};

// تصدير جميع الدوال - استخدم هذا الشكل الصحيح
module.exports = {
  createSection: exports.createSection,
  getAllSections: exports.getAllSections,
  getSectionById: exports.getSectionById,
  updateSubPage: exports.updateSubPage,
  deleteSection: exports.deleteSection,
  updateSection: exports.updateSection
};