import { getUserInfo } from '@/services/auth/getUserInfo';
import React from 'react';
import DashboardSidebarContent from './DashboardSidebarContent';
import { NavSection } from '@/types/dashboard.interface';
import { getDefaultDashboardRoute } from '@/lib/auth-utils';

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo();
  const navItems: NavSection[] = [];
  const dashboardHome = getDefaultDashboardRoute(userInfo.role)

  return <DashboardSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />;
};

export default DashboardSidebar;