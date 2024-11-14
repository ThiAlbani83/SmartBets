import { useState } from "react";
import AdminInvitePage from "./AdminInvitePage";
import AdminAccordion from "../../components/AdminAccordion";
import UsersManagement from "../../components/UsersManagement";

const AdminPanel = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const toggleInviteAccordion = () => {
    setIsInviteOpen(!isInviteOpen);
  };

  const toggleManageAccordion = () => {
    setIsManageOpen(!isManageOpen);
  };

  return (
    <div className="flex flex-col w-full h-full gap-10">
      <AdminAccordion title={"Convidar Usuário"} component={<AdminInvitePage />} height={"h-[230px]"} />
      <AdminAccordion title={"Gerenciar Usuários"} component={<UsersManagement />} height={"h-[500px]"} />
    </div>
  );
};
export default AdminPanel;
