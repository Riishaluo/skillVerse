import React, { useEffect, useState } from "react";
import { Edit, Eye, EyeOff } from "lucide-react";
import {
    getSkills,
    updateSkill,
    toggleSkill,
} from "../../service/adminService/skillService";

const SkillList = ({ type, refreshFlag }) => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const data = await getSkills();
            setSkills(type === "admin" ? data.adminSkills : data.userSkills);
        } catch (err) {
            console.error("Error fetching skills:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, [type, refreshFlag]);

    const handleEdit = async (id, currentName) => {
        const newName = prompt("Edit skill name:", currentName);
        if (!newName || newName === currentName) return;

        try {
            await updateSkill(id, { name: newName });
            fetchSkills();
        } catch (err) {
            console.error("Error updating skill:", err);
        }
    };

    const handleToggle = async (id) => {
        console.log('here working')
        console.log(skills)
        try {
                console.log(id)
                const updatedSkill = await toggleSkill(id);
                setSkills((prev) =>
                    prev.map((skill) =>
                        skill._id === id ? { ...skill, active: updatedSkill.active } : skill
                    )
                );
        } catch (err) {
            console.error("Error toggling skill:", err);
        }
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="p-2">Skill Name</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill) => (
                        <tr key={skill._id} className="border-t">
                            <td className="p-2">{skill.name}</td>
                            <td className="p-2">
                                {skill.active ? (
                                    <span className="text-green-600">Active</span>
                                ) : (
                                    <span className="text-red-600">Inactive</span>
                                )}
                            </td>
                            <td className="p-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(skill._id, skill.name)}
                                    className="p-2 bg-yellow-500 text-white rounded-lg"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleToggle(skill._id)}
                                    className="p-2 bg-gray-700 text-white rounded-lg"
                                >
                                    {skill.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {skills.length === 0 && (
                <p className="text-gray-500 mt-4">No skills found.</p>
            )}
        </div>
    );
};

export default SkillList;
