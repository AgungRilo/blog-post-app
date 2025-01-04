import React, { ComponentType, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRouter } from 'next/router';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const HOC = (props: P) => {
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth.isAuthenticated
    );
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/'); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Return nothing or a loader if not authenticated
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for debugging purposes
  HOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return HOC;
};

export default withAuth;
