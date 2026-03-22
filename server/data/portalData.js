export const navItems = ['Dashboard', 'Smart Match', 'Exam Alerts', 'Fast Apply']

export const quickFilters = [
  '12th pass jobs in Uttar Pradesh',
  'Graduate banking jobs in Bihar',
  'Police jobs with high match score',
  'Engineering jobs closing soon',
]

export const sectors = ['Any', 'Police', 'Bank', 'Engineering', 'Administration', 'Healthcare']

export const qualifications = [
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Graduate',
  'B.Tech',
  'Postgraduate',
]

export const states = ['Any', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Rajasthan', 'Madhya Pradesh', 'India','Telengana','Punjab','Gujrat','Maharastra','']

export const jobs = [
  {
    id: 1,
    title: 'UP Police Constable',
    qualification: '12th Pass',
    location: 'Uttar Pradesh',
    sector: 'Police',
    lastDate: '25 May 2026',
    applyUrl: 'https://uppbpb.gov.in',
    urgencyDays: 12,
    description:
      'Large-volume police recruitment with strong fit for 12th pass candidates looking for field roles in Uttar Pradesh.',
    skills: ['physical fitness', 'state preference', '12th pass eligible'],
  },
  {
    id: 2,
    title: 'SSC CHSL',
    qualification: '12th Pass',
    location: 'India',
    sector: 'Administration',
    lastDate: '10 June 2026',
    applyUrl: 'https://ssc.gov.in',
    urgencyDays: 28,
    description:
      'Central recruitment option for 12th pass candidates who want broad clerical and assistant-level opportunities.',
    skills: ['all india', 'computer awareness', '12th pass eligible'],
  },
  {
    id: 3,
    title: 'IBPS Clerk',
    qualification: 'Graduate',
    location: 'India',
    sector: 'Bank',
    lastDate: '18 June 2026',
    applyUrl: 'https://www.ibps.in/',
    urgencyDays: 36,
    description:
      'Popular banking exam with nationwide posting opportunities and high demand from graduate candidates.',
    skills: ['banking', 'aptitude', 'graduate eligible'],
  },
  {
    id: 4,
    title: 'Junior Engineer - PWD',
    qualification: 'Diploma',
    location: 'Uttar Pradesh',
    sector: 'Engineering',
    lastDate: '28 June 2026',
    applyUrl: 'https://pwd.maharashtra.gov.in/en/',
    urgencyDays: 46,
    description:
      'Technical role for diploma and engineering-track applicants interested in public works infrastructure.',
    skills: ['technical exam', 'site work', 'diploma eligible'],
  },
  {
    id: 5,
    title: 'Delhi Staff Nurse',
    qualification: 'Graduate',
    location: 'Delhi',
    sector: 'Healthcare',
    lastDate: '15 June 2026',
    applyUrl: 'https://health.delhi.gov.in/health/nursing-vacancy-and-para-medical-staff-mohfw',
    urgencyDays: 33,
    description:
      'Healthcare recruitment suited to nursing graduates seeking stable urban government roles.',
    skills: ['healthcare', 'graduate eligible', 'city posting'],
  },
  {
    id: 6,
    title: 'Bihar Revenue Assistant',
    qualification: 'Graduate',
    location: 'Bihar',
    sector: 'Administration',
    lastDate: '06 June 2026',
    applyUrl: 'https://land.bihar.gov.in/landbihar/Default.aspx',
    urgencyDays: 24,
    description:
      'Administrative vacancy with strong relevance for graduates targeting Bihar state government work.',
    skills: ['state exam', 'document work', 'graduate eligible'],
  },
]

export const introMessage =
  'Tell me your qualification, state, and preferred sector. I will rank openings, explain the match, and tell you what to do next.'

export const hero = {
  badge: 'AI Job Strategy Desk ChatBot',
  title: 'Sarkari Job Intelligence',
  subtitle:
    'A smarter, working assistant that understands profile signals, ranks openings by fit, and turns job search into a clear action plan.',
}

export const metrics = [
  { label: 'Live job signals', value: jobs.length },
  { label: 'Profile-aware scoring', value: '100%' },
  { label: 'Actionable next steps', value: 'Yes' },
]

export const profileDefaults = {
  qualification: '12th Pass',
  state: 'Uttar Pradesh',
  sector: 'Any',
}
