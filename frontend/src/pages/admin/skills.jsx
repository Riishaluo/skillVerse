import React from "react";
import SkillTabs from "../../component/adminComponents/skillTab";
import AdminSidebar from "./sidebar";

const SkillManagement = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Skill Management</h1>
        <SkillTabs />
      </div>
    </div>
  );
};

export default SkillManagement;
