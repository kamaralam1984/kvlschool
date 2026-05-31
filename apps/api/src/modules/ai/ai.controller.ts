import { Request, Response, NextFunction } from 'express'
import OpenAI from 'openai'
import { AuthenticatedRequest } from '../../common/guards/auth.guard'
import { Student } from '../students/student.model'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SCHOOL_CONTEXT = `You are KVL School Assistant, a helpful AI for KVL International School.
You help students, parents, and teachers with academic queries, admission information,
school policies, and general educational guidance. Always be polite, professional, and accurate.
School Name: KVL International School | CBSE Affiliated | Est. 1994 | New Delhi`

function checkApiKey(res: Response): boolean {
  const key = process.env.OPENAI_API_KEY
  if (!key || key === 'sk-your-openai-key-here' || key === 'placeholder') {
    res.status(500).json({
      success: false,
      message: 'Please add OPENAI_API_KEY to environment variables. Open apps/api/.env and set your OpenAI API key, then restart the server.',
      configured: false,
    })
    return false
  }
  return true
}

export class AIController {
  async chat(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { messages, stream = false } = req.body

      const systemMessages = [{ role: 'system' as const, content: SCHOOL_CONTEXT }]
      const allMessages = [...systemMessages, ...messages.slice(-10)]

      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        const completion = await openai.chat.completions.create({
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          messages: allMessages,
          stream: true,
          max_tokens: 1000,
        })

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content ?? ''
          if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`)
        }
        res.write('data: [DONE]\n\n')
        res.end()
      } else {
        const completion = await openai.chat.completions.create({
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          messages: allMessages,
          max_tokens: 1000,
        })
        res.json({
          success: true,
          data: {
            reply: completion.choices[0].message.content,
            model: process.env.AI_MODEL || 'gpt-4o-mini',
          },
        })
      }
    } catch (err: any) {
      if (err?.status === 401 || err?.code === 'invalid_api_key') {
        return res.status(500).json({
          success: false,
          message: 'Please add OPENAI_API_KEY to environment variables. The current key is invalid.',
          configured: false,
        })
      }
      next(err)
    }
  }

  async generateQuestions(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { subject, className, topic, count = 10, type = 'MCQ' } = req.body
      const prompt = `Generate ${count} ${type} questions for Class ${className} ${subject} on the topic: "${topic}".
For each MCQ, provide 4 options (A, B, C, D) and mark the correct answer.
Format clearly with question number, question text, options, and answer key at the end.
Align with CBSE/NCERT syllabus. Include a mix of difficulty levels.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an experienced CBSE curriculum expert and question paper setter for KVL International School.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
      })
      res.json({ success: true, data: { questions: completion.choices[0].message.content, model: process.env.AI_MODEL || 'gpt-4o-mini' } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async generateLessonPlan(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { subject, className, topic, duration = 45 } = req.body
      const prompt = `Create a detailed ${duration}-minute lesson plan for Class ${className} ${subject} on the topic: "${topic}".
Include:
- Learning objectives (3-4 points)
- Time breakdown table (Hook, Instruction, Practice, Assessment, Wrap-up)
- Teaching aids and resources
- Key vocabulary
- Assessment method
- Homework assignment
Align with NCERT/CBSE curriculum for KVL International School.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a skilled CBSE curriculum designer and master teacher at KVL International School.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1500,
      })
      res.json({ success: true, data: { lessonPlan: completion.choices[0].message.content, model: process.env.AI_MODEL || 'gpt-4o-mini' } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async generateCircular(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { title, details, audience = 'parents', date } = req.body
      const prompt = `Write a formal school circular for KVL International School.
Title/Event: ${title}
Details: ${details}
Audience: ${audience}
Date: ${date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

Include: Circular number, formal greeting, event details, instructions, RSVP/action required, and sign-off by Principal Mrs. Kavitha Lakshmi.
Tone: Professional, warm, and clear.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are the administrative secretary at KVL International School drafting official communications.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 800,
      })
      res.json({ success: true, data: { circular: completion.choices[0].message.content, model: process.env.AI_MODEL || 'gpt-4o-mini' } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async analyzePerformance(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { className, section, subject, data } = req.body
      const prompt = `Analyze the academic performance data for Class ${className}${section ? ` Section ${section}` : ''}${subject ? ` in ${subject}` : ''} at KVL International School.
${data ? `Data provided: ${JSON.stringify(data)}` : 'Use general CBSE performance benchmarks for analysis.'}

Provide:
1. Overall performance summary
2. Key strengths and weaknesses
3. Students at risk (attendance/marks below threshold)
4. Subject-wise insights
5. Actionable recommendations for teachers
6. Suggested interventions
Return structured, actionable insights.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an educational data analyst specializing in CBSE school performance metrics at KVL International School.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1200,
      })
      res.json({ success: true, data: { analysis: completion.choices[0].message.content, model: process.env.AI_MODEL || 'gpt-4o-mini' } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async admissionAssistant(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { query, parentName, childAge, currentClass } = req.body
      const context = `You are KVL School Admission Assistant.
Parent: ${parentName}, Child Age: ${childAge}, Current Class: ${currentClass}.
Provide helpful admission guidance. Key info: admissions open for 2025-26,
fee structure available on request, entrance test required for classes 6-12.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: query },
        ],
        max_tokens: 500,
      })

      res.json({ success: true, data: { reply: completion.choices[0].message.content } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async studentPerformanceAnalysis(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const student = await Student.findById(req.params.id)
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found.' })
      }

      const prompt = `Analyze the academic performance for a student in Class ${student.class}, Section ${student.section}.
Generate insights on:
1. Predicted performance areas
2. Attendance correlation
3. Subject-wise strength/weakness patterns
4. Personalized improvement recommendations
Return as structured JSON.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 800,
      })

      res.json({ success: true, data: JSON.parse(completion.choices[0].message.content ?? '{}') })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async attendancePrediction(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: { prediction: 'AI attendance prediction placeholder', confidence: 0.87 } })
    } catch (err) { next(err) }
  }

  async feePrediction(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: { prediction: 'Fee collection prediction placeholder', confidence: 0.92 } })
    } catch (err) { next(err) }
  }

  async generateMarketingEmail(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { campaign, targetAudience, keyMessage } = req.body
      const prompt = `Write a professional marketing email for ${campaign} targeting ${targetAudience}.
Key message: ${keyMessage}. School: KVL International School.
Tone: warm, professional, trustworthy. Include subject line, preview text, body, and CTA.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      })
      res.json({ success: true, data: { email: completion.choices[0].message.content } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async generateSocialPost(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { platform, topic, tone = 'professional' } = req.body
      const prompt = `Write a ${platform} post about "${topic}" for KVL International School. Tone: ${tone}.
Include relevant hashtags. Platform: ${platform}.`

      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
      })
      res.json({ success: true, data: { post: completion.choices[0].message.content } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }

  async admissionInsights(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: { insights: 'AI admission insights placeholder' } })
    } catch (err) { next(err) }
  }

  async academicInsights(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: { insights: 'AI academic insights placeholder' } })
    } catch (err) { next(err) }
  }

  async summarizeDocument(req: Request, res: Response, next: NextFunction) {
    if (!checkApiKey(res)) return
    try {
      const { text } = req.body
      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Summarize the following educational document concisely.' },
          { role: 'user', content: text },
        ],
        max_tokens: 500,
      })
      res.json({ success: true, data: { summary: completion.choices[0].message.content } })
    } catch (err: any) {
      if (err?.status === 401) return res.status(500).json({ success: false, message: 'Please add OPENAI_API_KEY to environment variables.', configured: false })
      next(err)
    }
  }
}
