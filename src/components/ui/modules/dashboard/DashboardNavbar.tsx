import DashboardNavbarContent from "./DashboardNavbarContent";
import { getUserInfo } from "@/services/auth/getUserInfo";
// import { UserInfo } from "@/types/user.interface";

const DashboardNavbar = async () => {
  // const userInfo = (await getUserInfo()) as UserInfo;
  const userInfo = await getUserInfo();
  return <DashboardNavbarContent userInfo={userInfo} />;
};

export default DashboardNavbar;
