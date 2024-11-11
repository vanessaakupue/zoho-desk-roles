export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const url = `https://desk.zoho.com/api/v1/roles/${id}/delete`;

  try {
    const body = { ...req.body };
      if (body.transferToRoleId) {
        body.transferToRoleId = String(body.transferToRoleId);
      }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'orgId': process.env.ORG_ID,
        'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = response;

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete role');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Delete role error:', error);
    // return res.status(500).json({
    //   error: error.message,
    //   details: error.toString(),
    //   stack: error.stack
    // });
  }
}