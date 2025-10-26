import axios from "axios";

const API_BASE = "http://localhost:7123/api"; // Using HTTP for local development

export async function getCampaigns() {
  try {
    const res = await axios.get(`${API_BASE}/campaigns`);
    return Array.isArray(res.data) ? res.data : res.data.campaigns || [];
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to the API server. Make sure the backend is running on port 7123');
    }
    throw error;
  }
}

export async function updateCampaignStatus(id, newStatus) {
  try {
    const res = await axios.post(
      `${API_BASE}/campaigns/${id}/status`,
      { newStatus },
      {
        headers: { "X-API-KEY": "Ad-Api-Key-123" },
      }
    );
}
