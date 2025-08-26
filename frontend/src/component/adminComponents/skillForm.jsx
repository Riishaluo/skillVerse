import React, { useState } from "react"
import { addSkill } from "../../service/adminService/skillService"

const SkillForm = ({ onSuccess }) => {
  const [skill, setSkill] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!skill.trim()) {
      setError("Skill name cannot be empty.")
      return
    }

    if (!/^[A-Za-z]/.test(skill)) {
      setError("Skill name must start with a letter.")
      return
    }

    try {
      setLoading(true)
      await addSkill({ name: skill.trim(), createdByAdmin: true })
      setSkill("")
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Error adding skill:", err)
      setError("Failed to add skill. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
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
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}

export default SkillForm
