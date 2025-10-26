import React, { useEffect, useState } from "react";
import { getCampaigns,updateCampaignStatus } from "../Api/campaignapi";

export default function CampaignTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");

  // ✅ Load campaigns
  const loadData = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (e) {
      setError("Failed to load campaigns");
    }
  };

  useEffect(() => {
    loadData();

    // ✅ Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    // cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle optimistic update
  const handleStatusChange = async (id, newStatus) => {
    const oldCampaigns = [...campaigns];
    const updated = campaigns.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setCampaigns(updated);

    try {
      await updateCampaignStatus(id, newStatus);
    } catch (e) {
      setCampaigns(oldCampaigns);
      alert("Failed to update status. Invalid key or transition.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!campaigns.length) return <p>Loading...</p>;

  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Budget</th>
          <th>Change Status</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.name}</td>
            <td>{c.status}</td>
            <td>{c.budget}</td>
            <td>
              <select
                defaultValue=""
                onChange={(e) => handleStatusChange(c.id, e.target.value)}
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Archived">Archived</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
