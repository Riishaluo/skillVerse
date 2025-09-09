import React, { useState } from "react";
import SkillList from "./skillList";
import SkillForm from "./skillForm";

const SkillTabs = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshSkills = () => setRefreshFlag((prev) => !prev);

  return (
    <div>
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("admin")}
          className={`pb-2 ${
            activeTab === "admin"
              ? "border-b-2 border-blue-500 font-bold"
              : ""
          }`}
        >
          Admin Skills
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`pb-2 ${
            activeTab === "user"
              ? "border-b-2 border-blue-500 font-bold"
              : ""
          }`}
        >
          User Skills
        </button>
      </div>

      {activeTab === "admin" && (
        <div>
          <SkillForm onSuccess={refreshSkills} />
          <SkillList type="admin" refreshFlag={refreshSkills} />
        </div>
      )}
      {activeTab === "user" && (
        <div>
          <SkillList type="user" refreshFlag={refreshSkills} />
        </div>
      )}
    </div>
  );
};

export default SkillTabs;
