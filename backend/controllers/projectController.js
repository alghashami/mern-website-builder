const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');

// جلب بيانات المشروع (للوحة التحكم)
exports.getProject = async (req, res) => {
  try {
    let project = await Project.findOne();
    if (!project) {
      project = new Project({ projectId: uuidv4().slice(0, 8) });
      await project.save();
    }
    res.json(project);
  } catch (err) {
    console.error('❌ Error in getProject:', err);
    res.status(500).json({ error: err.message });
  }
};

// إنشاء مشروع جديد (مع projectId فريد)
exports.createProject = async (req, res) => {
  try {
    const projectId = uuidv4().slice(0, 8);
    const newProject = new Project({ projectId });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('❌ Error in createProject:', err);
    res.status(500).json({ error: err.message });
  }
};

// جلب مشروع بواسطة projectId (للعرض العام)
exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId }).populate('sections');
    if (!project) return res.status(404).json({ msg: 'المشروع غير موجود' });
    res.json(project);
  } catch (err) {
    console.error('❌ Error in getProjectBySlug:', err);
    res.status(500).json({ error: err.message });
  }
};

// تحديث بيانات الموقع (الاسم، العنوان، الوصف)
exports.updateProject = async (req, res) => {
  try {
    const { siteName, headerTitle, headerDesc } = req.body;
    let project = await Project.findOne();
    if (!project) {
      project = new Project({ projectId: uuidv4().slice(0, 8) });
    }
    if (siteName) project.siteName = siteName;
    if (headerTitle) project.headerTitle = headerTitle;
    if (headerDesc) project.headerDesc = headerDesc;
    await project.save();
    res.json(project);
  } catch (err) {
    console.error('❌ Error in updateProject:', err);
    res.status(500).json({ error: err.message });
  }
};

// نشر الموقع (إخفاء أدوات التحرير)
exports.publishProject = async (req, res) => {
  try {
    console.log('🔍 Publish project called');
    
    let project = await Project.findOne();
    console.log('📦 Project found:', project);
    
    if (!project) {
      console.log('⚠️ No project found, creating new one');
      project = new Project({ projectId: uuidv4().slice(0, 8) });
      await project.save();
      console.log('✅ New project created:', project.projectId);
    }
    
    // التأكد من وجود projectId
    if (!project.projectId) {
      console.log('⚠️ Project has no projectId, adding one');
      project.projectId = uuidv4().slice(0, 8);
    }
    
    project.isPublished = true;
    await project.save();
    console.log('✅ Project published successfully');
    
    res.json({ 
      message: '✅ تم نشر الموقع بنجاح!', 
      isPublished: true,
      projectId: project.projectId 
    });
  } catch (err) {
    console.error('❌ Error in publishProject:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

// إلغاء النشر (إظهار أدوات التحرير مجدداً)
exports.unpublishProject = async (req, res) => {
  try {
    console.log('🔍 Unpublish project called');
    
    let project = await Project.findOne();
    
    // إذا لم يكن هناك مشروع، أو كان المشروع بدون projectId، أنشئ واحداً جديداً
    if (!project || !project.projectId) {
      console.log('⚠️ No valid project found, creating new one');
      project = new Project({ 
        projectId: uuidv4().slice(0, 8)
      });
      await project.save();
      console.log('✅ New project created:', project.projectId);
    }
    
    project.isPublished = false;
    await project.save();
    console.log('✅ Project unpublished successfully');
    
    res.json({ 
      message: '🔄 تم إلغاء النشر، يمكنك التعديل الآن', 
      isPublished: false,
      projectId: project.projectId 
    });
  } catch (err) {
    console.error('❌ Error in unpublishProject:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};