import React, { useState, useEffect } from 'react';
import API from '../api';
import SectionCard from '../components/SectionCard';

function HomePage() {
  const [sections, setSections] = useState([]);
  const [project, setProject] = useState(null);

  const fetchProject = async () => {
    const res = await API.get('/project');
    setProject(res.data);
  };

  const fetchSections = async () => {
    const res = await API.get('/sections');
    setSections(res.data);
  };

  useEffect(() => {
    fetchProject();
    fetchSections();
  }, []);

  return (
    <div>
 <header style={{ textAlign: 'center', padding: '20px', background: '#f0f0f0' }}>
  <h1>{project?.siteName || 'إنشاء مواقع ويب'}</h1>
  <p>{project?.headerTitle || 'أنشئ صفحتك بسهولة'}</p>
  {project?.headerDesc && <p style={{ fontSize: '0.9rem', color: '#666' }}>{project.headerDesc}</p>}
</header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))', gap: '20px', padding: '20px' }}>
        {sections.map(sec => <SectionCard key={sec._id} section={sec} />)}
      </div>
    </div>
  );
}

export default HomePage;