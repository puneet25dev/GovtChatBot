import express from 'express'
import cors from 'cors'
import {
  hero,
  introMessage,
  jobs,
  metrics,
  navItems,
  profileDefaults,
  qualifications,
  quickFilters,
  sectors,
  states,
} from './data/portalData.js'

const app = express()

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',           // Local development
  'http://localhost:3000',           // Alternative local port
  process.env.FRONTEND_URL,          // Production frontend (set in Render env vars)
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'))
    }
  },
  credentials: true,
}))
app.use(express.json())

function normalize(value = '') {
  return value.toLowerCase().trim()
}

function qualificationLevel(value) {
  const levels = {
    '10th pass': 1,
    '12th pass': 2,
    diploma: 3,
    graduate: 4,
    'b.tech': 5,
    postgraduate: 6,
  }

  return levels[normalize(value)] ?? 0
}

function extractPreferences(message, profile = {}) {
  const query = normalize(message)
  const matchedQualification = qualifications.find((item) => query.includes(normalize(item)))
  const matchedState = states.find((item) => item !== 'Any' && query.includes(normalize(item)))
  const matchedSector = sectors.find((item) => item !== 'Any' && query.includes(normalize(item)))

  return {
    qualification: matchedQualification ?? profile.qualification ?? profileDefaults.qualification,
    state: matchedState ?? profile.state ?? profileDefaults.state,
    sector: matchedSector ?? profile.sector ?? profileDefaults.sector,
    query,
  }
}

function scoreJob(job, preference) {
  let score = 48
  const reasons = []

  if (qualificationLevel(preference.qualification) >= qualificationLevel(job.qualification)) {
    score += 18
    reasons.push('Eligible by qualification')
  } else {
    score -= 28
    reasons.push('Qualification may be below requirement')
  }

  if (preference.state === 'Any' || normalize(job.location) === normalize(preference.state) || job.location === 'India') {
    score += 15
    reasons.push('Matches your location preference')
  }

  if (preference.sector === 'Any' || normalize(job.sector) === normalize(preference.sector)) {
    score += 14
    reasons.push('Aligned with your sector interest')
  }

  if (preference.query && normalize(job.title).includes(preference.query)) {
    score += 10
    reasons.push('Direct title match')
  }

  if (
    preference.query &&
    (normalize(job.description).includes(preference.query) ||
      job.skills.some((skill) => normalize(skill).includes(preference.query)))
  ) {
    score += 8
    reasons.push('Query matched role details')
  }

  if (preference.query.includes('soon') || preference.query.includes('urgent') || preference.query.includes('last date')) {
    score += Math.max(0, 16 - Math.floor(job.urgencyDays / 2))
    reasons.push('Deadline urgency considered')
  }

  const matchScore = Math.max(32, Math.min(98, score))
  const priority = matchScore >= 82 ? 'High' : matchScore >= 66 ? 'Medium' : 'Low'

  return {
    ...job,
    matchScore,
    priority,
    readiness: matchScore >= 82 ? 'Apply first' : matchScore >= 66 ? 'Prepare next' : 'Keep as backup',
    summary: job.description,
    reasons: reasons.slice(0, 3),
  }
}

function buildAdvice(preference, rankedJobs) {
  const topJob = rankedJobs[0]

  if (!topJob) {
    return {
      headline: 'Broaden the search window',
      summary: 'No strong match was found. Try switching the sector to Any or choosing a broader location like India.',
    }
  }

  return {
    headline: `${topJob.title} is your strongest current lead`,
    summary: `Your profile is leaning toward ${preference.sector === 'Any' ? topJob.sector : preference.sector} roles in ${preference.state}. Focus first on openings where you are already eligible and the deadline is closer.`,
  }
}

function buildInsights(preference, rankedJobs) {
  const topJob = rankedJobs[0]
  const fastClosing = [...rankedJobs].sort((a, b) => a.urgencyDays - b.urgencyDays)[0]
  const sectorCount = new Set(rankedJobs.map((job) => job.sector)).size

  return [
    {
      title: 'Best fit signal',
      text: topJob
        ? `${topJob.title} currently leads with a ${topJob.matchScore}% match score.`
        : 'No strong fit yet. Try broadening your profile or query.',
    },
    {
      title: 'Urgency watch',
      text: fastClosing
        ? `${fastClosing.title} closes the soonest, so keep its documents ready first.`
        : 'No urgent deadlines detected.',
    },
    {
      title: 'Coverage spread',
      text: `${sectorCount || 0} sectors are represented in your current ranked list for ${preference.qualification} candidates.`,
    },
  ]
}

function buildFollowUps(preference, rankedJobs) {
  const topJob = rankedJobs[0]

  return [
    {
      title: 'Check eligibility carefully',
      text: `Start with ${topJob ? topJob.title : 'the top-ranked opening'} and verify age limit, documents, and state-specific conditions before applying.`,
    },
    {
      title: 'Prepare a short target list',
      text: `Keep your first 2 to 3 applications around ${preference.sector === 'Any' ? 'your highest scoring jobs' : `${preference.sector.toLowerCase()} roles`} so your preparation stays focused.`,
    },
    {
      title: 'Track deadlines weekly',
      text: 'Re-run the assistant whenever your qualification, state target, or exam preference changes so the ranking stays relevant.',
    },
  ]
}

function buildReply(message, preference, rankedJobs) {
  if (!message.trim()) {
    return 'I analyzed your default profile and ranked the best openings for you.'
  }

  if (!rankedJobs.length) {
    return 'I did not find a strong match yet, so I recommend widening the location or sector filters.'
  }

  return `I analyzed your request for ${preference.qualification} candidates in ${preference.state} and ranked the best fits by eligibility, location, sector, and urgency.`
}

function getRankedJobs(message = '', profile = {}) {
  const preference = extractPreferences(message, profile)
  const ranked = jobs
    .map((job) => scoreJob(job, preference))
    .sort((first, second) => second.matchScore - first.matchScore)

  const filtered = ranked.filter((job) => {
    if (preference.sector !== 'Any' && normalize(job.sector) !== normalize(preference.sector)) {
      return false
    }

    if (preference.state !== 'Any' && normalize(job.location) !== normalize(preference.state) && job.location !== 'India') {
      return false
    }

    if (
      preference.query &&
      ![job.title, job.description, job.location, job.sector, ...job.skills].some((field) =>
        normalize(field).includes(preference.query),
      )
    ) {
      return job.matchScore >= 70
    }

    return true
  })

  const finalJobs = (filtered.length ? filtered : ranked).slice(0, 4)

  return {
    preference,
    jobs: finalJobs,
    advice: buildAdvice(preference, finalJobs),
    insights: buildInsights(preference, finalJobs),
    followUps: buildFollowUps(preference, finalJobs),
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/portal', (_req, res) => {
  const initial = getRankedJobs('', profileDefaults)

  res.json({
    hero: {
      ...hero,
      introMessage,
    },
    navItems,
    quickFilters,
    metrics,
    profileDefaults,
    profileOptions: {
      qualifications,
      states,
      sectors,
    },
    jobs: initial.jobs,
    insights: initial.insights,
    followUps: initial.followUps,
    advice: initial.advice,
    reply: 'I ranked a fresh set of government jobs using your default search profile.',
  })
})

app.post('/api/chat', (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message : ''
  const profile = typeof req.body?.profile === 'object' && req.body.profile ? req.body.profile : profileDefaults
  const result = getRankedJobs(message, profile)

  res.json({
    message,
    reply: buildReply(message, result.preference, result.jobs),
    jobs: result.jobs,
    insights: result.insights,
    followUps: result.followUps,
    advice: result.advice,
  })
})

export default app
