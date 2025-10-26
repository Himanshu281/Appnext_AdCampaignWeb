import React, { useEffect, useState, useRef } from 'react';

const STATUSES = ['Active', 'Paused', 'Archived'];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useValidKey, setUseValidKey] = useState(true);
  const pendingUpdates = useRef({});

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://localhost:7111/api/Campaigns');
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      // API returns { campaigns: [...] } or an array; handle both
      const list = Array.isArray(data) ? data : data.campaigns || [];
      setCampaigns(list);
    } catch (err) {
      setError('Failed to load campaigns: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    const iv = setInterval(fetchCampaigns, 10000); // refresh every 10s
    return () => clearInterval(iv);
  }, []);

  const changeStatus = async (id, newStatus) => {
    setError(null);
    // optimistic update
    setCampaigns(prev => {
      return prev.map(c => (c.id === id ? { ...c, status: newStatus } : c));
    });

    // store previous status in case we need to revert
    const prev = campaigns.find(c => c.id === id)?.status;
    pendingUpdates.current[id] = prev;

    try {
      const res = await fetch(`https://localhost:7111/api/Campaigns/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': useValidKey ? 'Ad-Api-Key-123' : 'invalid-key-000'
        },
        body: JSON.stringify({ newStatus })
      });

      // backend simulates delay; handle non-2xx
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Server ${res.status} ${text}`);
      }

      // success: remove pending marker
      delete pendingUpdates.current[id];
    } catch (err) {
      // revert optimistic update
      setCampaigns(prevList => prevList.map(c => (c.id === id ? { ...c, status: pendingUpdates.current[id] } : c)));
      delete pendingUpdates.current[id];
      setError(`Failed to update campaign ${id}: ${err.message}`);
    }
  };

  return (
    <div className="campaigns-root">
      <div className="controls">
        <label>
          <input type="checkbox" checked={useValidKey} onChange={e => setUseValidKey(e.target.checked)} />
          Use valid API key (toggle to simulate failure)
        </label>
      </div>

      {loading && <div>Loading campaigns...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && campaigns.length === 0 && <div>No campaigns found.</div>}

      {campaigns.length > 0 && (
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id} className={`status-${c.status?.toLowerCase()}`}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.status}</td>
                <td>{typeof c.budget === 'number' ? c.budget.toLocaleString() : c.budget}</td>
                <td>
                  <select
                    value={c.status}
                    onChange={e => changeStatus(c.id, e.target.value)}
                    aria-label={`Change status for campaign ${c.id}`}>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 12 }}>
        <small>Campaign list auto-refreshes every 10s. Optimistic updates are reverted on errors.</small>
      </div>
    </div>
  );
}
