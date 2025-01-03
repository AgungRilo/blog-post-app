import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth.isAuthenticated
    );
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/'); // Redirect ke login jika belum login
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Tampilkan loading atau kosong jika belum login
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
