import { useState } from 'react';
import API from '../api';

function AddSectionModal({ show, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError('الرجاء إدخال العنوان واختيار صورة');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('coverImage', file);
    try {
      await API.post('/sections', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onAdd();
      onClose();
      setTitle('');
      setFile(null);
      setError('');
    } catch (err) {
      setError('❌ حدث خطأ أثناء الإضافة');
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 999
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '15px',
        width: '450px',
        maxWidth: '95%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>➕ إضافة قسم جديد</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="عنوان القسم (مثل: ديكورات الجبيل)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
            dir="rtl"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{ marginBottom: '15px', display: 'block' }}
          />
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button type="submit" disabled={loading} style={{
              background: '#007bff',
              color: 'white',
              padding: '10px 30px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              {loading ? 'جاري الحفظ...' : '💾 حفظ القسم'}
            </button>
            <button type="button" onClick={onClose} style={{
              background: '#6c757d',
              color: 'white',
              padding: '10px 30px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSectionModal;