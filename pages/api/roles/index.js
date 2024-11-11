export default async function handler(req, res) {

  const url = 'https://desk.zoho.com/api/v1/roles';
  
  if (req.method === 'GET') {
    try {
      const response = await fetch(url, {
        headers: {
          'orgId': process.env.ORG_ID,
          'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roles');
      }
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
  }
  
  if (req.method === 'POST') {
    try {

      const body = { ...req.body };
      if (body.reportsTo) {
        body.reportsTo = String(body.reportsTo);
      }

      const response = await fetch(url, {
        method: 'POST',
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
      console.error('Detailed error:', error); 
      // return res.status(500).json({ 
      //   error: error.message,
      //   details: error.toString(),
      //   stack: error.stack 
      // });
    }
  }
}