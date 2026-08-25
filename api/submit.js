export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.PABBLY_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('PABBLY_WEBHOOK_URL is not configured')
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  try {
    const pabblyResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })

    if (!pabblyResponse.ok) {
      const text = await pabblyResponse.text()
      console.error('Pabbly webhook error', pabblyResponse.status, text)
      return res.status(502).json({ error: 'Failed to submit survey' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error forwarding survey submission', error)
    return res.status(500).json({ error: 'Failed to submit survey' })
  }
}
