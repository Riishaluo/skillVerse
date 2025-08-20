import React, { useState } from "react"
import { addSkill } from "../../service/adminService/skillService"

const SkillForm = ({ onSuccess }) => {
  const [skill, setSkill] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!skill.trim()) return

    try {
      setLoading(true)
      await addSkill({ name: skill, createdByAdmin: true })
      setSkill("")
      if (onSuccess) onSuccess() 
    } catch (err) {
      console.error("Error adding skill:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Enter new skill"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  )
}

export default SkillForm
