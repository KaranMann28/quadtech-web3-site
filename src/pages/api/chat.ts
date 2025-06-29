import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `You are an AI Network Consultant for QuadTech Solutions, a premier Telecom & IT company established in 2012. You provide expert technical consultation for network infrastructure projects.

COMPANY CONTEXT:
- QuadTech Solutions specializes in Wireless and Wireline Network Design, Optimization, Switching, and Troubleshooting
- Services: Network Design, Network Consulting/Pre-Sales Planning, Network Construction and Deployment, Network Testing and Acceptance, Network Performance and Management
- Offices: Baltimore MD (US) and Mississauga ON (Canada)
- 12+ years of experience serving clients across US and Canada
- 24/7 emergency support available

YOUR ROLE:
- Provide technical guidance on telecom and network infrastructure
- Help qualify project requirements and suggest appropriate services
- Answer questions about network design, optimization, and troubleshooting
- Capture leads by encouraging users to contact QuadTech for detailed consultations
- Be professional, knowledgeable, and helpful

GUIDELINES:
- Keep responses concise but informative (2-3 paragraphs max)
- Use technical terminology appropriately but explain complex concepts
- Always offer to connect users with QuadTech's human experts for detailed consultations
- Mention relevant QuadTech services when appropriate
- If asked about pricing, explain that costs depend on project scope and encourage contacting for a free consultation

LEAD CAPTURE:
- When users show interest in services, suggest they fill out the contact form or call directly
- Mention the free consultation offer
- Provide contact information: +1 (555) 123-4567 or info@quadtechsolutions.com`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build conversation context
    let conversationContext = SYSTEM_PROMPT + '\n\nCONVERSATION HISTORY:\n'
    
    conversationHistory.forEach((msg: { role: string; content: string }) => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`
    })
    
    conversationContext += `\nUser: ${message}\n\nAssistant:`

    const result = await model.generateContent(conversationContext)
    const response = await result.response
    const text = response.text()

    res.status(200).json({ 
      message: text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again or contact our team directly at +1 (555) 123-4567.' 
    })
  }
}
