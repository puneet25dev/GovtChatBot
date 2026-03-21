import { useEffect, useRef, useState } from 'react'

const defaultProfile = {
  qualification: '12th Pass',
  state: 'Uttar Pradesh',
  sector: 'Any',
  experienceLevel: 'Fresher',
  jobType: 'Any',
  examTimeline: '1-3 Months',
  language: 'Hindi + English',
  relocation: 'Within State',
  workStyle: 'Office Based',
  priorityFocus: 'Long-Term Stability',
  studyPace: 'Daily 1-2 Hours',
}

const emptyConversation = []
const interviewOptions = {
  experienceLevels: ['Fresher', '0-2 Years', '2-5 Years'],
  jobTypes: ['Any', 'Field Duty', 'Clerical', 'Technical', 'Public Service', 'Healthcare Support'],
  examTimelines: ['Immediate', '1-3 Months', 'Flexible'],
  languages: ['Hindi', 'English', 'Hindi + English'],
  relocations: ['Within State', 'Anywhere in India', 'Home State Only'],
  workStyles: ['Office Based', 'Field Based', 'Hybrid'],
  priorityFocuses: ['Fast Joining', 'Long-Term Stability', 'Prestige', 'State Preference'],
  studyPaces: ['Daily 1-2 Hours', 'Daily 3-4 Hours', 'Weekend Focus'],
}

const guidedInterviewSteps = [
  {
    field: 'qualification',
    question: 'What is your highest qualification?',
    getOptions: (portal) => portal?.profileOptions?.qualifications ?? [],
  },
  {
    field: 'state',
    question: 'Which state do you want jobs in?',
    getOptions: (portal) => portal?.profileOptions?.states ?? [],
  },
  {
    field: 'sector',
    question: 'Which sector do you prefer?',
    getOptions: (portal) => portal?.profileOptions?.sectors ?? [],
  },
  {
    field: 'experienceLevel',
    question: 'How much experience do you have?',
    getOptions: () => interviewOptions.experienceLevels,
  },
  {
    field: 'jobType',
    question: 'What kind of role do you want?',
    getOptions: () => interviewOptions.jobTypes,
  },
  {
    field: 'examTimeline',
    question: 'When do you want to target the exam or application?',
    getOptions: () => interviewOptions.examTimelines,
  },
  {
    field: 'language',
    question: 'Which language are you most comfortable using for preparation?',
    getOptions: () => interviewOptions.languages,
  },
  {
    field: 'relocation',
    question: 'How flexible are you about relocation?',
    getOptions: () => interviewOptions.relocations,
  },
  {
    field: 'workStyle',
    question: 'What work style suits you better?',
    getOptions: () => interviewOptions.workStyles,
  },
  {
    field: 'priorityFocus',
    question: 'What matters most to you in the final shortlist?',
    getOptions: () => interviewOptions.priorityFocuses,
  },
  {
    field: 'studyPace',
    question: 'How much preparation time can you realistically give each week?',
    getOptions: () => interviewOptions.studyPaces,
  },
]

const jobBlueprints = {
  1: {
    experienceLevel: 'Fresher',
    jobType: 'Field Duty',
    examTimeline: 'Immediate',
    language: 'Hindi',
    relocation: 'Home State Only',
    workStyle: 'Field Based',
    priorityFocus: 'Fast Joining',
    milestones: [
      'Verify physical standards, age limit, and category relaxations.',
      'Prepare a 4-week physical routine with running, stamina, and timing drills.',
      'Finish the online application early and keep photo, signature, and certificates ready.',
      'Revise GK, reasoning, and law-order basics with timed mocks.',
      'Prepare for PET/PST and final document verification.',
    ],
  },
  2: {
    experienceLevel: 'Fresher',
    jobType: 'Clerical',
    examTimeline: '1-3 Months',
    language: 'Hindi + English',
    relocation: 'Anywhere in India',
    workStyle: 'Office Based',
    priorityFocus: 'Prestige',
    milestones: [
      'Read the CHSL notification and mark key dates for registration and admit card.',
      'Build a section-wise plan for English, reasoning, quantitative aptitude, and GK.',
      'Start typing and document handling practice if the post needs it.',
      'Track weekly mock scores and improve speed under exam conditions.',
      'Prepare for final document verification and post preference decisions.',
    ],
  },
  3: {
    experienceLevel: 'Fresher',
    jobType: 'Clerical',
    examTimeline: '1-3 Months',
    language: 'English',
    relocation: 'Anywhere in India',
    workStyle: 'Office Based',
    priorityFocus: 'Long-Term Stability',
    milestones: [
      'Map the IBPS calendar and keep registration, prelims, and mains dates visible.',
      'Practice quantitative aptitude and reasoning daily with accuracy targets.',
      'Build a banking awareness notebook for current affairs and terminology.',
      'Simulate prelims and mains under strict timing every week.',
      'Keep documents and preference order ready for final allocation stages.',
    ],
  },
  4: {
    experienceLevel: '0-2 Years',
    jobType: 'Technical',
    examTimeline: 'Flexible',
    language: 'Hindi + English',
    relocation: 'Within State',
    workStyle: 'Field Based',
    priorityFocus: 'Long-Term Stability',
    milestones: [
      'Review diploma eligibility, technical syllabus, and trade-specific topics.',
      'Create a revision tracker for formulas, drawings, and core engineering concepts.',
      'Keep certificates, internship papers, and technical documents organized.',
      'Solve previous JE-style technical questions in a timed format.',
      'Prepare for site-oriented responsibilities and technical verification.',
    ],
  },
  5: {
    experienceLevel: '0-2 Years',
    jobType: 'Healthcare Support',
    examTimeline: '1-3 Months',
    language: 'Hindi + English',
    relocation: 'Within State',
    workStyle: 'Office Based',
    priorityFocus: 'Long-Term Stability',
    milestones: [
      'Confirm registration, healthcare qualification, and hospital posting rules.',
      'Refresh nursing fundamentals, protocols, and patient-care responses.',
      'Prepare a compliance and documentation checklist for medical recruitment.',
      'Practice scenario-based MCQs and communication answers.',
      'Get ready for skill checks, panel interaction, and certificate verification.',
    ],
  },
  6: {
    experienceLevel: 'Fresher',
    jobType: 'Public Service',
    examTimeline: 'Immediate',
    language: 'Hindi',
    relocation: 'Home State Only',
    workStyle: 'Office Based',
    priorityFocus: 'State Preference',
    milestones: [
      'Verify domicile, qualification, reservation, and administrative eligibility.',
      'Collect all state-specific documents before opening the application form.',
      'Prepare Bihar-focused current affairs, basic aptitude, and clerical skills.',
      'Practice document-heavy workflows and written mock tests.',
      'Track final notice updates and be ready for state-level verification.',
    ],
  },
}

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    time: new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date()),
  }
}

function buildInterviewGreeting(stepCount, firstQuestion) {
  return `Hello! I will ask ${stepCount} focused questions and then suggest the best jobs for you. ${firstQuestion}`
}

function buildRoadmapChatMessage(job, roadmap) {
  const openingStep = roadmap.milestones[0] ?? 'review the notification carefully'
  const nextStep = roadmap.milestones[1] ?? 'create a weekly preparation schedule'

  return `I prepared a roadmap for ${job.title}. Start with ${openingStep} After that, move to ${nextStep}`
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function buildRoadmap(job, profile) {
  const blueprint = jobBlueprints[job.id] ?? {}
  const focusBySector = {
    Police: 'Mix written prep with physical endurance and document readiness.',
    Bank: 'Prioritize aptitude, reasoning, speed, and current affairs.',
    Engineering: 'Keep technical revision structured with formulas and practical concepts.',
    Administration: 'Focus on GS, clerical workflow, and official-document accuracy.',
    Healthcare: 'Refresh technical fundamentals, compliance, and scenario-based responses.',
  }

  return {
    title: `Roadmap for ${job.title}`,
    summary: `This roadmap is built for a ${profile.qualification} candidate targeting ${job.sector} roles in ${profile.state}.`,
    strategy: `${focusBySector[job.sector] ?? 'Follow the notification carefully and prepare in weekly blocks.'} Recommended pace: ${profile.studyPace}.`,
    milestones:
      blueprint.milestones ?? [
        'Review the notification and confirm eligibility.',
        'Collect documents and complete the application early.',
        'Build a weekly preparation routine for the written stage.',
        'Take mocks and track weak areas every week.',
        'Prepare for the final stage and document verification.',
      ],
    checklist: [
      'Official notification reviewed',
      'Documents folder prepared',
      'Weekly preparation calendar created',
      'Mock-test plan scheduled',
      `Application deadline tracked: ${job.lastDate}`,
    ],
    candidateSignals: [
      `Qualification: ${profile.qualification}`,
      `Location target: ${profile.state}`,
      `Sector: ${profile.sector}`,
      `Priority: ${profile.priorityFocus}`,
      `Study pace: ${profile.studyPace}`,
    ],
  }
}

function enhanceJobs(rawJobs, profile) {
  return [...rawJobs]
    .map((job) => {
      const blueprint = jobBlueprints[job.id] ?? {}
      let scoreBoost = 0
      const extraReasons = []

      if (blueprint.experienceLevel) {
        const experienceMatched =
          profile.experienceLevel === blueprint.experienceLevel ||
          (profile.experienceLevel === '0-2 Years' && blueprint.experienceLevel === 'Fresher')

        if (experienceMatched) {
          scoreBoost += 5
          extraReasons.push('Experience preference aligned')
        }
      }

      if (blueprint.jobType && (profile.jobType === 'Any' || profile.jobType === blueprint.jobType)) {
        scoreBoost += 6
        extraReasons.push('Preferred role format matched')
      }

      if (blueprint.examTimeline && (profile.examTimeline === 'Flexible' || profile.examTimeline === blueprint.examTimeline)) {
        scoreBoost += 4
        extraReasons.push('Timeline preference matched')
      }

      if (blueprint.language && (profile.language === 'Hindi + English' || profile.language === blueprint.language)) {
        scoreBoost += 3
        extraReasons.push('Language comfort matched')
      }

      const relocationMatched =
        profile.relocation === 'Anywhere in India' ||
        profile.relocation === blueprint.relocation ||
        (profile.relocation === 'Within State' && blueprint.relocation !== 'Anywhere in India')

      if (blueprint.relocation && relocationMatched) {
        scoreBoost += 3
        extraReasons.push('Relocation preference matched')
      }

      if (blueprint.workStyle && (profile.workStyle === 'Hybrid' || profile.workStyle === blueprint.workStyle)) {
        scoreBoost += 3
        extraReasons.push('Work style matched')
      }

      if (blueprint.priorityFocus && profile.priorityFocus === blueprint.priorityFocus) {
        scoreBoost += 4
        extraReasons.push('Priority focus aligned')
      }

      const matchScore = clamp((job.matchScore ?? 50) + scoreBoost, 35, 99)
      const priority = matchScore >= 84 ? 'High' : matchScore >= 68 ? 'Medium' : 'Low'

      return {
        ...job,
        blueprint,
        matchScore,
        priority,
        reasons: [...new Set([...(job.reasons ?? []), ...extraReasons])].slice(0, 5),
      }
    })
    .sort((first, second) => second.matchScore - first.matchScore)
}

function App() {
  const [portal, setPortal] = useState(null)
  const [profile, setProfile] = useState(defaultProfile)
  const [messages, setMessages] = useState(emptyConversation)
  const [jobs, setJobs] = useState([])
  const [insights, setInsights] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [advice, setAdvice] = useState(null)
  const [reply, setReply] = useState('')
  const [input, setInput] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [resumeName, setResumeName] = useState('')
  const [resumeSummary, setResumeSummary] = useState(null)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [analyzingResume, setAnalyzingResume] = useState(false)
  const [interviewStep, setInterviewStep] = useState(0)
  const [error, setError] = useState('')
  const messageStreamRef = useRef(null)
  const totalSteps = guidedInterviewSteps.length
  const currentQuestion = guidedInterviewSteps[interviewStep]
  const progressPercent = Math.round((Math.min(interviewStep, totalSteps) / totalSteps) * 100)
  const interviewGreeting = buildInterviewGreeting(totalSteps, guidedInterviewSteps[0].question)
  const profileSummary = [
    { label: 'Qualification', value: profile.qualification },
    { label: 'Location', value: profile.state },
    { label: 'Sector', value: profile.sector },
    { label: 'Priority', value: profile.priorityFocus },
  ]
  const topMatch = jobs[0]
  const interviewReady = interviewStep >= totalSteps

  useEffect(() => {
    const stream = messageStreamRef.current

    if (stream) {
      stream.scrollTop = stream.scrollHeight
    }
  }, [messages, sending])

  useEffect(() => {
    let active = true

    async function loadPortal() {
      try {
        const response = await fetch('/api/portal')
        if (!response.ok) {
          throw new Error('Failed to load portal')
        }

        const data = await response.json()
        if (!active) {
          return
        }

        const initialProfile = {
          qualification: data.profileDefaults?.qualification ?? defaultProfile.qualification,
          state: data.profileDefaults?.state ?? defaultProfile.state,
          sector: data.profileDefaults?.sector ?? defaultProfile.sector,
          experienceLevel: data.profileDefaults?.experienceLevel ?? defaultProfile.experienceLevel,
          jobType: data.profileDefaults?.jobType ?? defaultProfile.jobType,
          examTimeline: data.profileDefaults?.examTimeline ?? defaultProfile.examTimeline,
          language: data.profileDefaults?.language ?? defaultProfile.language,
          relocation: data.profileDefaults?.relocation ?? defaultProfile.relocation,
          workStyle: data.profileDefaults?.workStyle ?? defaultProfile.workStyle,
          priorityFocus: data.profileDefaults?.priorityFocus ?? defaultProfile.priorityFocus,
          studyPace: defaultProfile.studyPace,
        }

        setPortal(data)
        setJobs(enhanceJobs(data.jobs ?? [], initialProfile))
        setInsights(data.insights ?? [])
        setFollowUps(data.followUps ?? [])
        setAdvice(data.advice ?? null)
        setReply(data.reply ?? '')
        setMessages([
          createMessage(
            'assistant',
            interviewGreeting,
          ),
        ])
        setProfile(initialProfile)
      } catch (loadError) {
        if (!active) {
          return
        }
        setError('Portal could not be loaded. Start the backend with `npm run server` and refresh.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPortal()

    return () => {
      active = false
    }
  }, [interviewGreeting])

  async function requestMatches(message, profileOverride, baseMessages) {
    setMessages(baseMessages)
    setInput('')
    setSending(true)
    setError('')
    setSelectedJobId(null)
    setRoadmap(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          profile: profileOverride,
          resumeText,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      setJobs(enhanceJobs(data.jobs ?? [], profileOverride))
      setInsights(data.insights ?? [])
      setFollowUps(data.followUps ?? [])
      setAdvice(data.advice ?? null)
      setReply(data.reply ?? '')
      setMessages([
        ...baseMessages,
        createMessage('assistant', data.reply ?? 'I found some options for you.'),
      ])
    } catch (requestError) {
      setError('The assistant could not respond. Make sure the backend is running and try again.')
    } finally {
      setSending(false)
    }
  }

  async function askAssistant(message, profileOverride = profile) {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || sending) {
      return
    }

    const nextMessages = [...messages, createMessage('user', trimmedMessage)]
    await requestMatches(trimmedMessage, profileOverride, nextMessages)
  }

  function handleSubmit(event) {
    event.preventDefault()
    askAssistant(input)
  }

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function refreshForProfile() {
    setInterviewStep(guidedInterviewSteps.length)
    const summary = `Find the best ${profile.sector === 'Any' ? '' : `${profile.sector} `}jobs for ${profile.qualification} candidates in ${profile.state}.`
    await askAssistant(summary.replace(/\s+/g, ' ').trim())
  }

  function startGuidedInterview() {
    const initialProfile = {
      qualification: portal?.profileDefaults?.qualification ?? defaultProfile.qualification,
      state: portal?.profileDefaults?.state ?? defaultProfile.state,
      sector: portal?.profileDefaults?.sector ?? defaultProfile.sector,
      experienceLevel: portal?.profileDefaults?.experienceLevel ?? defaultProfile.experienceLevel,
      jobType: portal?.profileDefaults?.jobType ?? defaultProfile.jobType,
      examTimeline: portal?.profileDefaults?.examTimeline ?? defaultProfile.examTimeline,
      language: portal?.profileDefaults?.language ?? defaultProfile.language,
      relocation: portal?.profileDefaults?.relocation ?? defaultProfile.relocation,
      workStyle: portal?.profileDefaults?.workStyle ?? defaultProfile.workStyle,
      priorityFocus: portal?.profileDefaults?.priorityFocus ?? defaultProfile.priorityFocus,
      studyPace: defaultProfile.studyPace,
    }

    setProfile(initialProfile)
    setResumeSummary(null)
    setSelectedJobId(null)
    setRoadmap(null)
    setInterviewStep(0)
    setMessages([
      createMessage(
        'assistant',
        interviewGreeting,
      ),
    ])
  }

  async function handleGuidedAnswer(answer) {
    if (sending || analyzingResume) {
      return
    }

    const currentStep = guidedInterviewSteps[interviewStep]
    if (!currentStep) {
      return
    }

    const nextProfile = {
      ...profile,
      [currentStep.field]: answer,
    }
    const answeredMessages = [...messages, createMessage('user', answer)]
    const nextStep = interviewStep + 1

    setProfile(nextProfile)

    if (nextStep < guidedInterviewSteps.length) {
      setInterviewStep(nextStep)
      setMessages([
        ...answeredMessages,
        createMessage('assistant', guidedInterviewSteps[nextStep].question),
      ])
      return
    }

    setInterviewStep(guidedInterviewSteps.length)

    const summary = [
      `Suggest jobs for ${nextProfile.qualification} candidates in ${nextProfile.state} for ${nextProfile.sector} sector.`,
      `Experience: ${nextProfile.experienceLevel}.`,
      `Role type: ${nextProfile.jobType}.`,
      `Timeline: ${nextProfile.examTimeline}.`,
      `Language: ${nextProfile.language}.`,
      `Relocation: ${nextProfile.relocation}.`,
      `Work style: ${nextProfile.workStyle}.`,
      `Priority: ${nextProfile.priorityFocus}.`,
      `Study pace: ${nextProfile.studyPace}.`,
    ].join(' ')
    const baseMessages = [
      ...answeredMessages,
      createMessage('assistant', 'Thank you. I have enough details now and I am matching jobs for you.'),
    ]

    await requestMatches(summary, nextProfile, baseMessages)
  }

  async function handleResumeUpload(event) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const normalized = text.replace(/\s+/g, ' ').trim()

      if (!normalized) {
        setError('This file does not contain readable text. Upload a text-based resume or paste resume content.')
        return
      }

      setResumeText(normalized)
      setResumeName(file.name)
      setResumeSummary(null)
      setError('')
    } catch (uploadError) {
      setError('Resume could not be read. Try a text-based file like TXT, MD, or a text-exported resume.')
    }
  }

  async function analyzeResume() {
    if (!resumeText.trim() || analyzingResume) {
      return
    }

    setAnalyzingResume(true)
    setError('')

    try {
      const normalizedResume = resumeText.toLowerCase()
      const qualificationOptions = [...(portal?.profileOptions?.qualifications ?? [])].reverse()
      const stateOptions = portal?.profileOptions?.states ?? []
      const sectorOptions = portal?.profileOptions?.sectors ?? []
      const skillCatalog = [
        'physical fitness',
        'computer awareness',
        'typing',
        'documentation',
        'banking',
        'aptitude',
        'technical exam',
        'site work',
        'healthcare',
        'nursing',
        'administration',
        'data entry',
      ]

      const inferredQualification =
        qualificationOptions.find((item) => normalizedResume.includes(item.toLowerCase())) ?? profile.qualification
      const inferredState =
        stateOptions.find((item) => item !== 'Any' && normalizedResume.includes(item.toLowerCase())) ?? profile.state
      const inferredSector =
        sectorOptions.find((item) => item !== 'Any' && normalizedResume.includes(item.toLowerCase())) ?? profile.sector
      const inferredSkills = skillCatalog.filter((item) => normalizedResume.includes(item))
      const inferredProfile = {
        qualification: inferredQualification,
        state: inferredState,
        sector: inferredSector,
        experienceLevel: profile.experienceLevel,
        jobType: profile.jobType,
        examTimeline: profile.examTimeline,
        language: profile.language,
        relocation: profile.relocation,
        workStyle: profile.workStyle,
        priorityFocus: profile.priorityFocus,
        studyPace: profile.studyPace,
      }

      setProfile(inferredProfile)
      setInterviewStep(guidedInterviewSteps.length)
      setSelectedJobId(null)
      setRoadmap(null)
      setResumeSummary({
        ...inferredProfile,
        skills: inferredSkills,
      })

      const prompt = [
        `Suggest jobs from my resume.`,
        `Qualification: ${inferredQualification}.`,
        `Preferred state: ${inferredState}.`,
        `Sector: ${inferredSector}.`,
        `Skills: ${inferredSkills.join(', ') || 'general profile'}.`,
      ].join(' ')

      await askAssistant(prompt, inferredProfile)
    } catch (analysisError) {
      setError('Resume analysis failed. Make sure the backend is running and try again.')
    } finally {
      setAnalyzingResume(false)
    }
  }

  function handleSelectJob(job) {
    const nextRoadmap = buildRoadmap(job, profile)

    setSelectedJobId(job.id)
    setRoadmap(nextRoadmap)

    if (selectedJobId !== job.id) {
      setMessages((current) => [...current, createMessage('assistant', buildRoadmapChatMessage(job, nextRoadmap))])
    }
  }

  if (loading) {
    return (
      <main className="app-shell">
        <section className="loading-panel">
          <p className="eyebrow">Mission Control</p>
          <h1>Booting the Sarkari intelligence layer...</h1>
        </section>
      </main>
    )
  }

  if (error && !portal) {
    return (
      <main className="app-shell">
        <section className="loading-panel">
          <p className="eyebrow">Connection Error</p>
          <h1>{error}</h1>
        </section>
      </main>
    )
  }

  return (
    <main className={`app-shell ${sending ? 'app-live' : ''}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="layout-grid">
        <div className="main-column">
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">{portal?.hero?.badge ?? 'AI Job Strategy Desk'}</p>
              <h1>{portal?.hero?.title}</h1>
              <p className="hero-text">{portal?.hero?.subtitle}</p>

              <div className="hero-summary-row">
                {profileSummary.map((item, index) => (
                  <article
                    key={item.label}
                    className="summary-chip"
                    style={{ '--motion-delay': `${120 + index * 80}ms` }}
                  >
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>

              <div className="command-bar hero-command-bar">
                <div>
                  <span className="command-label">Live Brief</span>
                  <p>{reply}</p>
                </div>
                <button className="primary-button" type="button" onClick={refreshForProfile}>
                  Recalculate Matches
                </button>
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-stats">
                {(portal?.metrics ?? []).map((metric, index) => (
                  <article
                    key={metric.label}
                    className="metric-card"
                    style={{ '--motion-delay': `${180 + index * 90}ms` }}
                  >
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </article>
                ))}
              </div>

              <article className="executive-card">
                <span className="executive-label">Executive Snapshot</span>
                <h3>{topMatch ? topMatch.title : 'Interview in progress'}</h3>
                <p>
                  {interviewReady
                    ? `Top fit is ready. Current lead strength: ${topMatch?.matchScore ?? 0}% match.`
                    : `Guided discovery is ${progressPercent}% complete. Finish the questions for a final shortlist.`}
                </p>

                <div className="executive-tags">
                  <span>{resumeSummary ? 'Resume Calibrated' : 'Profile Guided'}</span>
                  <span>{interviewReady ? 'Result Ready' : 'Collecting Inputs'}</span>
                </div>
              </article>
            </div>
          </section>

          <section className="profile-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Candidate DNA</p>
                <h2>Your Search Profile</h2>
              </div>
              <span className="status-pill">Adaptive Ranking On</span>
            </div>

            <div className="profile-grid">
              <label>
                Qualification
                <select
                  value={profile.qualification}
                  onChange={(event) => updateProfile('qualification', event.target.value)}
                >
                  {(portal?.profileOptions?.qualifications ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Preferred State
                <select value={profile.state} onChange={(event) => updateProfile('state', event.target.value)}>
                  {(portal?.profileOptions?.states ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Sector Focus
                <select value={profile.sector} onChange={(event) => updateProfile('sector', event.target.value)}>
                  {(portal?.profileOptions?.sectors ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <article className="resume-card">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Resume Match</p>
                  <h2>Upload Resume</h2>
                </div>
                <span className="muted">{resumeName || 'No file selected'}</span>
              </div>

              <label className="upload-box">
                <input type="file" accept=".txt,.md,.json,.csv,.html,.xml" onChange={handleResumeUpload} />
                <strong>Choose a resume file</strong>
                <span>
                  Best results with text-based resumes. The app extracts skills, qualification, location, and sector
                  clues. PDF parsing is not enabled in this build yet.
                </span>
              </label>

              <textarea
                className="resume-textarea"
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Or paste your resume text here for matching..."
                rows={7}
              />

              <div className="job-actions">
                <button className="primary-button" type="button" onClick={analyzeResume} disabled={analyzingResume}>
                  {analyzingResume ? 'Reading Resume...' : 'Suggest Jobs From Resume'}
                </button>
                <span className="muted">Resume-first ranking overrides the generic profile-only match.</span>
              </div>

              {resumeSummary ? (
                <div className="resume-summary">
                  <span className="status-pill">Resume Signals Found</span>
                  <p>
                    Qualification: <strong>{resumeSummary.qualification}</strong> | Preferred State:{' '}
                    <strong>{resumeSummary.state}</strong> | Sector: <strong>{resumeSummary.sector}</strong>
                  </p>
                  <p>Skills spotted: {resumeSummary.skills.join(', ') || 'No strong skills detected yet'}</p>
                </div>
              ) : null}
            </article>

            {advice ? (
              <article className="advice-card">
                <p className="eyebrow">Strategy Note</p>
                <h3>{advice.headline}</h3>
                <p>{advice.summary}</p>
              </article>
            ) : null}

            <div className="insight-list">
              {insights.map((insight, index) => (
                <article
                  key={insight.title}
                  className="insight-card"
                  style={{ '--motion-delay': `${140 + index * 80}ms` }}
                >
                  <h3>{insight.title}</h3>
                  <p>{insight.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="results-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Ranked Opportunities</p>
                <h2>Best Current Matches</h2>
              </div>
              <span className="muted">{jobs.length} recommendations</span>
            </div>

            <div className="job-grid">
              {jobs.map((job, index) => (
                <article
                  key={job.id}
                  className={`job-card ${selectedJobId === job.id ? 'selected-job' : ''}`}
                  style={{ '--motion-delay': `${160 + index * 90}ms` }}
                >
                  <div className="job-topline">
                    <span className={`score-pill score-${job.priority.toLowerCase()}`}>{job.matchScore}% match</span>
                    <span className="job-tag">{job.sector}</span>
                  </div>

                  <h3>{job.title}</h3>
                  <p className="job-summary">{job.summary}</p>

                  <div className="job-meta">
                    <span>{job.qualification}</span>
                    <span>{job.location}</span>
                    <span>Apply by {job.lastDate}</span>
                  </div>

                  <div className="reason-list">
                    {(job.reasons ?? []).map((reason) => (
                      <span key={reason}>{reason}</span>
                    ))}
                  </div>

                  <div className="job-actions">
                    <div className="card-action-group">
                      <button className="secondary-button" type="button" onClick={() => handleSelectJob(job)}>
                        {selectedJobId === job.id ? 'Roadmap Open' : 'View Roadmap'}
                      </button>
                      <a href={job.applyUrl} className="primary-button mt-5">
                        Open Form
                      </a>
                    </div>
                    <div className="readiness">
                      <strong>{job.readiness}</strong>
                      <span>{job.priority} urgency</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={`roadmap-panel ${selectedJobId ? 'roadmap-ready' : ''}`}>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Selected Job Plan</p>
                <h2>{roadmap ? roadmap.title : 'Click A Matched Job To Generate A Roadmap'}</h2>
              </div>
              {selectedJobId ? <span className="status-pill">Roadmap Ready</span> : null}
            </div>

            {roadmap ? (
              <div key={selectedJobId} className="roadmap-content">
                <p className="roadmap-summary">{roadmap.summary}</p>
                <article className="roadmap-strategy">
                  <h3>Preparation Strategy</h3>
                  <p>{roadmap.strategy}</p>
                </article>

                <div className="roadmap-grid">
                  <div className="roadmap-list">
                    <h3>Milestones</h3>
                    {roadmap.milestones.map((item) => (
                      <article key={item} className="roadmap-item">
                        <span />
                        <p>{item}</p>
                      </article>
                    ))}
                  </div>

                  <div className="roadmap-list">
                    <h3>Checklist</h3>
                    {roadmap.checklist.map((item) => (
                      <article key={item} className="roadmap-item compact">
                        <span />
                        <p>{item}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="candidate-signal-row">
                  {roadmap.candidateSignals.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="roadmap-empty" key="roadmap-empty">
                <p>
                  After the profile match is complete, click any matched job card and this section will prepare a
                  tailored roadmap with milestones, checklist, and preparation direction for that role.
                </p>
              </div>
            )}
          </section>

          <section className="followup-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Next Moves</p>
                <h2>What To Do Now</h2>
              </div>
            </div>

            <div className="timeline">
              {followUps.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="timeline-item"
                  style={{ '--motion-delay': `${140 + index * 90}ms` }}
                >
                  <span className="timeline-index">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="assistant-column">
          <section className={`chat-panel ${sending ? 'chat-panel-live' : ''}`}>
          <div className="chat-header-bar">
            <div className="chat-header-profile">
              <div className="chat-avatar">AI</div>
              <div>
                <p className="eyebrow">Conversation Engine</p>
                <h2>Sarkari Match Assistant</h2>
              </div>
            </div>
            <div className={`chat-presence ${sending ? 'live' : ''}`}>
              <span className="presence-dot" />
              <span>{sending ? 'Analyzing live' : interviewReady ? 'Ready to refine matches' : 'Collecting answers'}</span>
              <span className="chat-live-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>

          <article className="welcome-card">
            <span className="welcome-badge">Welcome</span>
            <h3>Hello, I am your Sarkari Job Assistant.</h3>
            <p>
              I will ask {totalSteps} focused questions, understand your answers, and then show the best job matches
              for you.
            </p>
          </article>

          <article className="question-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Guided Chat</p>
                <h2>
                  {interviewStep < totalSteps
                    ? `Question ${interviewStep + 1} of ${totalSteps}`
                    : 'Interview Complete'}
                </h2>
              </div>
              <button className="secondary-button" type="button" onClick={startGuidedInterview}>
                Restart Questions
              </button>
            </div>

            <div className="interview-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${interviewReady ? 100 : progressPercent}%` }} />
              </div>
              <div className="progress-steps">
                {guidedInterviewSteps.map((step, index) => (
                  <div
                    key={step.field}
                    className={`progress-step ${index < interviewStep ? 'complete' : ''} ${
                      index === interviewStep && !interviewReady ? 'active' : ''
                    }`}
                    style={{ '--motion-delay': `${120 + index * 55}ms` }}
                  >
                    <span>{index + 1}</span>
                    <small>{step.field}</small>
                  </div>
                ))}
              </div>
            </div>

            <p className="question-text">
              {interviewStep < totalSteps
                ? currentQuestion?.question
                : 'You can now review the results below or continue chatting for more refined suggestions.'}
            </p>

            {interviewStep < totalSteps ? (
              <div className="question-options">
                {(currentQuestion?.getOptions(portal) ?? []).map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleGuidedAnswer(option)}
                    style={{ '--motion-delay': `${120 + index * 45}ms` }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </article>

          <div className={`message-stream ${sending ? 'live-chat' : ''}`} ref={messageStreamRef}>
            {messages.map((message, index) => (
              <article
                key={message.id ?? `${message.role}-${index}`}
                className={`message message-enter ${message.role === 'assistant' ? 'assistant' : 'user'}`}
                style={{ '--message-delay': `${Math.min(index * 45, 240)}ms` }}
              >
                <div className="message-meta">
                  <strong>{message.role === 'assistant' ? 'AI Advisor' : 'You'}</strong>
                  <span>{message.time}</span>
                </div>
                <p>{message.text}</p>
              </article>
            ))}

            {sending ? (
              <article className="message assistant typing-message live-response">
                <div className="message-meta">
                  <strong>AI Advisor</strong>
                  <span>typing...</span>
                </div>
                <div className="typing-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            ) : null}
          </div>

          {interviewReady ? (
            <div className="quick-actions">
              {(portal?.quickFilters ?? []).map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => askAssistant(item)}
                  style={{ '--motion-delay': `${120 + index * 50}ms` }}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={!interviewReady}
              placeholder={
                !interviewReady
                  ? 'Finish the guided questions above, or upload a resume for direct matching.'
                  : 'Example: I am a graduate from Bihar and want banking jobs with deadlines this month.'
              }
              rows={3}
            />
            <button
              className="primary-button"
              type="submit"
              disabled={sending || !interviewReady}
            >
              {sending ? 'Analyzing...' : 'Send Query'}
            </button>
          </form>

          {error ? <p className="error-text">{error}</p> : null}
          </section>
        </aside>
      </div>
    </main>
  )
}

export default App
