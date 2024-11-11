export default async function handler(req, res) {
  const { id } = req.query;
  const url = `https://desk.zoho.com/api/v1/roles/${id}`;

  if(req.method === 'GET') {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'orgId': process.env.ORG_ID,
          'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
        },
      })
  
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || `Zoho API error: ${response.status}`);
      }
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get role' });
    }

  }

  if (req.method === 'PATCH') {
    try {
      const body = { ...req.body };
      if (body.reportsTo) {
        body.reportsTo = String(body.reportsTo);
      }

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'orgId': process.env.ORG_ID,
          'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Zoho API error: ${response.status}`);
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error('Delete role error:', error);
      return res.status(500).json({ error: 'Failed to update role' });
    }
  }
}