import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { getProject, updateProject, publishProject, unpublishProject } from '../api';
import AddSectionModal from '../components/AddSectionModal';
import EditSectionModal from '../components/EditSectionModal';

function DashboardPage() {
  const [sections, setSections] = useState([]);
  const [project, setProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [publishMessage, setPublishMessage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerDesc, setHeaderDesc] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const baseURL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://mern-website-builder.onrender.com';

  const fetchProject = async () => {
    const res = await getProject();
    setProject(res.data);
    setSiteName(res.data.siteName || '');
    setHeaderTitle(res.data.headerTitle || '');
    setHeaderDesc(res.data.headerDesc || '');
  };

  const fetchSections = async () => {
    const res = await API.get('/sections');
    setSections(res.data);
  };

  useEffect(() => {
    fetchProject();
    fetchSections();
  }, []);

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await updateProject({ siteName, headerTitle, headerDesc });
      setUpdateMessage('✅ تم تحديث معلومات الموقع بنجاح!');
      fetchProject();
    } catch (err) {
      setUpdateMessage('❌ حدث خطأ أثناء التحديث');
    }
  };

  const handlePublish = async () => {
    try {
      const response = await publishProject();
      const { projectId } = response.data;
      setPublishMessage('✅ تم نشر الموقع بنجاح!');
      fetchProject();
      
      if (projectId) {
        setTimeout(() => {
          window.location.href = `/`;
        }, 1500);
      }
    } catch (err) {
      setPublishMessage('❌ حدث خطأ أثناء النشر');
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishProject();
      setPublishMessage('🔄 تم إلغاء النشر، يمكنك التعديل الآن');
      fetchProject();
      // لا يوجد انتقال إلى صفحة أخرى
    } catch (err) {
      setPublishMessage('❌ حدث خطأ');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القسم؟')) {
      try {
        await API.delete(`/sections/${sectionId}`);
        setSections(sections.filter(sec => sec._id !== sectionId));
        alert('✅ تم حذف القسم بنجاح!');
      } catch (err) {
        alert('❌ حدث خطأ أثناء الحذف');
      }
    }
  };

  const isPublished = project?.isPublished || false;

  const getImageUrl = (coverImage) => {
    if (!coverImage) return '';
    if (coverImage.startsWith('uploads/')) {
      return `${baseURL}/${coverImage}`;
    }
    return `${baseURL}/uploads/${coverImage}`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. تحرير معلومات الرئيسية */}
      <section style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h2 style={{ textAlign: 'right', marginBottom: '15px' }}>📝 تحرير معلومات الرئيسية</h2>
        <form onSubmit={handleUpdateProject} style={{ textAlign: 'right' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>اسم الموقع:</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} dir="rtl" />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>العنوان الرئيسي (الوصف القصير):</label>
            <input type="text" value={headerTitle} onChange={(e) => setHeaderTitle(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} dir="rtl" />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>الوصف التفصيلي:</label>
            <textarea value={headerDesc} onChange={(e) => setHeaderDesc(e.target.value)} rows="2" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} dir="rtl" />
          </div>
          <button type="submit" style={{ background: '#007bff', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            💾 حفظ معلومات الموقع
          </button>
          {updateMessage && <p style={{ marginTop: '10px', color: updateMessage.includes('✅') ? 'green' : 'red' }}>{updateMessage}</p>}
        </form>
      </section>

      {/* 2. إدارة الأقسام */}
      <section style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>📂 الأقسام (الصفحات الفرعية)</h2>
          <button onClick={() => setShowAddModal(true)} style={{ background: '#17a2b8', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            ➕ إضافة قسم جديد
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {sections.map((sec) => {
            const imageUrl = getImageUrl(sec.coverImage);
            return (
              <div key={sec._id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', background: 'white' }}>
                <Link to={`/section/${sec._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <div style={{ cursor: 'pointer' }}>
                    <img src={imageUrl} alt={sec.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <h3 style={{ padding: '12px', textAlign: 'center', fontSize: '16px', margin: 0 }}>{sec.title}</h3>
                  </div>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', borderTop: '1px solid #eee' }}>
                  <button 
                    onClick={() => {
                      setSelectedSection(sec);
                      setShowEditModal(true);
                    }} 
                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    ✏️ تعديل القسم
                  </button>
                  <button onClick={() => handleDeleteSection(sec._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                    🗑️ حذف
                  </button>
                </div>
              </div>
            );
          })}
          {sections.length === 0 && <p style={{ textAlign: 'right', width: '100%', color: '#999' }}>لا توجد أقسام مضافة بعد. أضف قسمك الأول!</p>}
        </div>
      </section>

      {/* 3. أزرار النشر */}
      <section style={{ background: '#e9ecef', padding: '20px', borderRadius: '10px', marginBottom: '30px', textAlign: 'center' }}>
        <h3>🚀 حالة الموقع: {isPublished ? '🔒 منشور (للزوار فقط)' : '✏️ وضع التحرير'}</h3>
        <div style={{ marginTop: '15px' }}>
          {!isPublished ? (
            <button onClick={handlePublish} style={{ background: '#28a745', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px' }}>
              🚀 نشر الموقع الآن
            </button>
          ) : (
            <button onClick={handleUnpublish} style={{ background: '#dc3545', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px' }}>
              🔧 إلغاء النشر (تعديل)
            </button>
          )}
          {publishMessage && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{publishMessage}</p>}
        </div>
      </section>

      {/* 4. مودال إضافة قسم */}
      <AddSectionModal show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={fetchSections} />

      {/* 5. مودال تعديل القسم */}
      <EditSectionModal 
        show={showEditModal} 
        onClose={() => {
          setShowEditModal(false);
          setSelectedSection(null);
        }} 
        section={selectedSection} 
        onUpdate={fetchSections} 
      />
    </div>
  );
}

export default DashboardPage;