import { getUserInfo } from '@/services/auth/getUserInfo';
import React from 'react';
import DashboardSidebarContent from './DashboardSidebarContent';

const DashboardSidebar = async() => {
      const userInfo = await getUserInfo();
    
    return <DashboardSidebarContent userInfo={userInfo} />;
};

export default DashboardSidebar;