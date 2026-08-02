import { Link } from 'react-router-dom';

function SectionCard({ section }) {
  const baseURL = 'https://mern-website-builder.onrender.com';
  const imageUrl = `${baseURL}/${section.coverImage}`;

  return (
    <Link to={`/section/${section._id}`} style={{ textDecoration: 'none', color: 'black' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
        <img src={imageUrl} alt={section.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <h3 style={{ padding: '10px', textAlign: 'center' }}>{section.title}</h3>
      </div>
    </Link>
  );
}

export default SectionCard;