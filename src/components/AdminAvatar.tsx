import Avvvatars from "avvvatars-react";
import { useAppSelector } from "../store/hooks";

const AdminAvatar = () => {
  const admin = useAppSelector((state) => state.user.userData);
  return <Avvvatars value={admin.email} style="character" />;
};

export default AdminAvatar;
