import axios from "axios";

const API_BASE = "https://localhost:7111/api";

export async function getCampaigns() {
  const res = await axios.get(`${API_BASE}/Campaign`);
  return res.data;
}

export async function updateCampaignStatus(id, newStatus) {
  return axios.post(
    `${API_BASE}/Campaign/${id}/status`,
    { newStatus },
    {
      headers: { "X-API-KEY": "Ad-Api-Key-123" },
    }
  );
}