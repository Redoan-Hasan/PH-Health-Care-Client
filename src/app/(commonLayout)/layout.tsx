import PublicNavbar from '@/components/ui/shared/PublicNavbar';
import React from 'react';

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div>
            <PublicNavbar />
            {children}
        </div>
    );
};

export default layout;