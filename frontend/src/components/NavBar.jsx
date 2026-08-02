import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      direction: 'rtl',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{
          color: '#ecf0f1',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '6px',
          transition: 'background 0.3s',
          background: '#34495e'
        }}>
          🏠 الرئيسية
        </Link>
        <Link to="/dashboard" style={{
          color: '#ecf0f1',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '8px 16px',
          borderRadius: '6px',
          transition: 'background 0.3s',
          background: '#e67e22'
        }}>
          ⚙️ لوحة التحكم
        </Link>
      </div>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        🎨 انشاء مواقع ويب
      </div>
    </nav>
  );
}

export default NavBar;