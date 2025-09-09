import React, { useEffect, useState } from "react";
import { Edit, Eye, EyeOff, Loader, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
    getSkills,
    updateSkill,
    toggleSkill,
} from "../../service/adminService/skillService";

const SkillList = ({ type, refreshFlag }) => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
        setCurrentPage(1); 
    }, [type, refreshFlag]);

    const handleEdit = async (id, currentName) => {
        const newName = prompt("Edit skill name:", currentName);
        if (!newName || newName === currentName) return;

        try {
            setUpdating(id);
            await updateSkill(id, { name: newName });
            fetchSkills();
        } catch (err) {
            console.error("Error updating skill:", err);
        } finally {
            setUpdating(null);
        }
    };

    const handleToggle = async (id) => {
        try {
            setUpdating(id);
            const updatedSkill = await toggleSkill(id);
            setSkills((prev) =>
                prev.map((skill) =>
                    skill._id === id ? { ...skill, active: updatedSkill.active } : skill
                )
            );
        } catch (err) {
            console.error("Error toggling skill:", err);
        } finally {
            setUpdating(null);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = skills.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(skills.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const goToFirstPage = () => {
        setCurrentPage(1);
    };
    
    const goToLastPage = () => {
        setCurrentPage(totalPages);
    }
    const Pagination = () => {
        if (totalPages <= 1) return null;
        
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                            <span className="font-medium">
                                {indexOfLastItem > skills.length ? skills.length : indexOfLastItem}
                            </span> of{" "}
                            <span className="font-medium">{skills.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={goToFirstPage}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">First</span>
                                <ChevronsLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === number
                                            ? "bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                            
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={goToLastPage}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Last</span>
                                <ChevronsRight className="h-4 w-4" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                    <p className="text-gray-600">Loading skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {type === "admin" ? "Admin Skills" : "User Skills"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {skills.length} {skills.length === 1 ? 'skill' : 'skills'} total
                    </p>
                </div>
                
                <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="text-sm text-gray-600 mr-2">
                        Show:
                    </label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="rounded-md border border-gray-300 py-1 px-2 text-sm"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Skill Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {currentItems.map((skill) => (
                            <tr key={skill._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {skill.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {skill.active ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(skill._id, skill.name)}
                                            disabled={updating === skill._id}
                                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                                            title="Edit skill"
                                        >
                                            {updating === skill._id ? (
                                                <Loader className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Edit size={16} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleToggle(skill._id)}
                                            disabled={updating === skill._id}
                                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                            title={skill.active ? "Deactivate skill" : "Activate skill"}
                                        >
                                            {updating === skill._id ? (
                                                <Loader className="h-4 w-4 animate-spin" />
                                            ) : skill.active ? (
                                                <Eye size={16} />
                                            ) : (
                                                <EyeOff size={16} />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {skills.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No skills found.</p>
                    </div>
                )}
            </div>
            
            {skills.length > 0 && <Pagination />}
        </div>
    );
};

export default SkillList;