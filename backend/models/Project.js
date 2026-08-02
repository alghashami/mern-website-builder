const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, unique: true, required: true },
  siteName: { type: String, default: 'إنشاء مواقع ويب' },
  headerTitle: { type: String, default: 'أنشئ صفحتك بسهولة' },
  headerDesc: { type: String, default: 'منصة لإنشاء صفحات الهبوط بكل احترافية' },
  isPublished: { type: Boolean, default: false },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }]
});

module.exports = mongoose.model('Project', ProjectSchema);