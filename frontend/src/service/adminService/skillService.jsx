// src/services/skillService.js
import axios from "axios";

const API_URL = "http://localhost:9999/admin"; 

export const getSkills = async () => {
  const res = await axios.get(`${API_URL}/skills-management`);
  return res.data;
};

export const addSkill = async (skill) => {
  const res = await axios.post(`${API_URL}/skills-management`, skill)
  return res.data;
}

export const updateSkill = async (id, updatedSkill) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedSkill);
  return res.data
};


export const toggleSkill = async (id) => {
    console.log('hai')
  const res = await axios.patch(`${API_URL}/skills-management/${id}/toggle`);
  return res.data;
}

