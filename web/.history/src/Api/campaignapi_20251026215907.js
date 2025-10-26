import axios from "axios";

const API_BASE = "https://localhost:7123/api"; // adjust backend port

export async function getCampaigns() {
  const res = await axios.get(`${API_BASE}/campaigns`);
  return res.data;
}

export async function updateCampaignStatus(id, newStatus) {
  return axios.post(
    `${API_BASE}/campaigns/${id}/status`,
    { newStatus },
    {
      headers: { "X-API-KEY": "Ad-Api-Key-123" },
    }
  );
}
