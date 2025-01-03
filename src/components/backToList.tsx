import { useRouter } from 'next/router';

interface BackToListProps {
  route?: string; // Default route untuk kembali
}

const BackToList: React.FC<BackToListProps> = ({ route = '/posts' }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(route)}
      style={{
        background: 'none',
        border: 'none',
        color: '#1890ff',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span style={{ fontSize: '18px' }}>←</span> Back to List
    </button>
  );
};

export default BackToList;
