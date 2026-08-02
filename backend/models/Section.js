const mongoose = require('mongoose');
const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },          // "ديكورات الجبيل"
  coverImage: { type: String, required: true },     // مسار صورة الغلاف
  // محتويات الصفحة الفرعية:
  subHeadlines: { type: [String], default: [] },    // مصفوفة (1-3 عناوين)
  subDetails: { type: String, default: '' },        // حقل التفاصيل
  galleryImages: { type: [String], default: [] }    // مصفوفة مسارات صور المعرض
}, { timestamps: true });
module.exports = mongoose.model('Section', SectionSchema);