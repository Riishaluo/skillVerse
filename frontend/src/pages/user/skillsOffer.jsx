import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SkillsOffered = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 

  const { email } = location.state || {};

  useEffect(() => {
    axios
      .get("http://localhost:9999/user/skills")
      .then((res) => setSkills(res.data.map((s) => s.name)))
      .catch((err) => console.error(err));
  }, []);

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setSearch("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill(search);
    }
  };

  const handleNext = () => {
    if (!email) {
      console.error("Email not found in navigation state");
      return;
    }

    let finalSkills = selectedSkills;
    if (search.trim() && !selectedSkills.includes(search.trim())) {
      finalSkills = [...selectedSkills, search.trim()];
    }

    navigate("/skills-wanted", {
      state: {
        email,
        skillsOffered: finalSkills,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700">SkillVerse</h1>
          <p className="text-sm text-gray-500 mt-1">Step 1 of 2 - Skills Offered</p>
        </div>

        <input
          type="text"
          placeholder="Search or add a skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border px-4 py-2 rounded-lg mb-4"
        />

        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSkills.map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button onClick={() => handleRemoveSkill(skill)} className="font-bold">×</button>
              </span>
            ))}
          </div>
        )}

        <p className="text-sm font-medium text-gray-700 mb-2">Popular Skills</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {skills.map((skill, i) => (
            <button
              key={i}
              onClick={() => handleAddSkill(skill)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full"
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={() => navigate("/skills-wanted", { state: { email } })} className="text-sm text-gray-500">Skip</button>
          <button onClick={handleNext} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsOffered;
