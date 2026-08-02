import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { getProject } from '../api';

function SectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [headlines, setHeadlines] = useState('');
  const [details, setDetails] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(true);
  const [message, setMessage] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const baseURL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://mern-website-builder.onrender.com';

  const fetchProjectStatus = async () => {
    try {
      const res = await getProject();
      setIsPublished(res.data.isPublished || false);
    } catch (err) {
      console.log('Error fetching project status');
    }
  };

  const fetchData = async () => {
    const res = await API.get(`/sections/${id}`);
    setSection(res.data);
    setHeadlines(res.data.subHeadlines.join(', '));
    setDetails(res.data.subDetails);
  };

  useEffect(() => {
    fetchProjectStatus();
    fetchData();
  }, [id]);

  const handleUpdateSubPage = async (e) => {
    e.preventDefault();
    setMessage('جاري الحفظ...');
    const formData = new FormData();
    formData.append('subHeadlines', headlines);
    formData.append('subDetails', details);
    for (let file of galleryFiles) {
      formData.append('galleryImages', file);
    }
    try {
      await API.put(`/sections/${id}/subpage`, formData);
      setMessage('✅ تم الحفظ بنجاح!');
      setIsEditing(false);
      setGalleryFiles([]);
      fetchData();
    } catch (err) {
      setMessage('❌ حدث خطأ، حاول مجدداً');
    }
  };

  if (!section) return <div style={{ textAlign: 'center', padding: '50px' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#333', marginBottom: '30px' }}>
        {section.title}
      </h1>

      <div style={{ textAlign: 'right', marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
        {section.subHeadlines && section.subHeadlines.length > 0 && (
          <div>
            {section.subHeadlines.map((item, index) => (
              <h2 key={index} style={{ color: '#2c3e50', marginBottom: '10px' }}>• {item}</h2>
            ))}
          </div>
        )}
        {section.subDetails && (
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginTop: '15px' }}>
            {section.subDetails}
          </p>
        )}
      </div>

      {isPublished && (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', color: '#856404', fontSize: '16px', fontWeight: 'bold' }}>
          🔒 هذا الموقع منشور، أنت تشاهده كزائر. للتعديل، اذهب إلى لوحة التحكم واضغط "إلغاء النشر".
        </div>
      )}

      {!isPublished && isEditing && (
        <form onSubmit={handleUpdateSubPage} style={{ border: '1px solid #ddd', padding: '25px', borderRadius: '10px', marginBottom: '30px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ textAlign: 'right', marginBottom: '15px' }}>✏️ تعديل المحتوى</h3>
          <div style={{ textAlign: 'right' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>العناوين الفرعية (افصل بينها بفاصلة):</label>
            <input type="text" value={headlines} onChange={(e) => setHeadlines(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'right' }} dir="rtl" />
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>التفاصيل:</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows="4" style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'right' }} dir="rtl" />
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>إضافة صور للمعرض:</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles([...e.target.files])} style={{ marginBottom: '15px', display: 'block' }} />
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
              <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                💾 حفظ المحتوى والصور
              </button>
            </div>
            {message && <p style={{ marginTop: '10px', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
          </div>
        </form>
      )}

      {!isPublished && !isEditing && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button onClick={() => { setIsEditing(true); setMessage(''); }} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '10px 30px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
            📝 تعديل المحتوى
          </button>
        </div>
      )}

      <h3 style={{ textAlign: 'right', marginBottom: '15px' }}>🖼️ معرض الصور</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'flex-start' }}>
        {section.galleryImages.map((img, idx) => (
          <img key={idx} src={`${baseURL}/${img}`} alt={`gallery-${idx}`} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #ddd' }} />
        ))}
        {section.galleryImages.length === 0 && <p style={{ textAlign: 'right', width: '100%', color: '#999' }}>📭 لا توجد صور مضافة بعد.</p>}
      </div>
    </div>
  );
}

export default SectionPage;