// Credentials, modelled once each. Skills are a many-to-many tag on the credential
// (previously every badge was copied into each skill category it belonged to).

export type SkillId = 'ai' | 'genai' | 'ml' | 'data' | 'cloud' | 'mongodb' | 'search' | 'tensorflow' | 'leadership';

export interface Skill {
  id: SkillId;
  label: string;
  inDemand?: boolean;
  futureProof?: boolean;
}

export interface Credential {
  name: string;
  issuer: string;
  /** ISO year-month (YYYY-MM) for sorting; `display` is shown to people. */
  issued: string;
  display: string;
  skills: SkillId[];
  credentialId?: string;
  /** Shown when there is no credential ID; defaults to 'Digital badge'. */
  format?: string;
  description?: string;
}

export const skills: Skill[] = [
  { id: 'ai', label: 'Artificial Intelligence', inDemand: true, futureProof: true },
  { id: 'genai', label: 'Generative AI', inDemand: true },
  { id: 'ml', label: 'Machine Learning', inDemand: true, futureProof: true },
  { id: 'data', label: 'Data Science', inDemand: true },
  { id: 'cloud', label: 'Cloud Computing', inDemand: true },
  { id: 'mongodb', label: 'MongoDB', futureProof: true },
  { id: 'search', label: 'Search Algorithms' },
  { id: 'tensorflow', label: 'TensorFlow', inDemand: true, futureProof: true },
  { id: 'leadership', label: 'Leadership' },
];

/** Brand tint per issuer, used for the issuer dot and initials mark. */
export const issuerColors: Record<string, string> = {
  'Google Cloud': '#4285F4',
  'Microsoft Elevate': '#0078D4',
  MongoDB: '#00684A',
  'DeepLearning.AI': '#F65B66',
  'ICT Authority': '#0F766E',
  'Cyber Shujaa': '#7C3AED',
  'Moringa School': '#F26E22',
  'One Dev Academy': '#e85d04',
  'ALX Africa': '#0B2A4A',
  'Leading Young': '#DB2777',
  Udacity: '#0284C7',
  'Jomo Kenyatta University': '#15803D',
};

export const credentials: Credential[] = [
  {
    name: 'Agent Memory: Building Memory-Aware Agents', issuer: 'DeepLearning.AI', issued: '2026-07', display: 'Jul 2026',
    skills: ['genai'], credentialId: '33ddbdf9-3e1e-4e15-a83e-d6d7a347646f',
  },
  {
    name: 'Agentic AI', issuer: 'DeepLearning.AI', issued: '2026-07', display: 'Jul 2026',
    skills: ['ai', 'genai'], credentialId: 'e2elacc8-7bbd-4a85-8549-dda3b7352a64',
    description: 'Planning and designing agentic systems, workflow orchestration and evaluating multi-agent workflows.',
  },
  {
    name: 'Artificial Intelligence Training', issuer: 'ICT Authority', issued: '2026-07', display: 'Jul 2026',
    skills: ['ai'], credentialId: 'CTA-1783118955-7426-44239',
    description: 'AI methodologies, implementation frameworks and digital workspace alignment.',
  },
  { name: 'AI Skills Badge 2025–26', issuer: 'Microsoft Elevate', issued: '2026-01', display: 'Jan 31, 2026', skills: ['ai', 'genai'] },
  {
    name: 'AI Automation Engineering', issuer: 'One Dev Academy', issued: '2025-11', display: 'Nov 2025',
    skills: ['ai'], description: 'Planning and orchestration of AI automation systems.',
  },
  { name: 'Prompt Design in Vertex AI', issuer: 'Google Cloud', issued: '2025-11', display: 'Nov 16, 2025', skills: ['ai', 'genai'] },
  { name: 'Prepare Data for ML APIs on Google Cloud', issuer: 'Google Cloud', issued: '2025-11', display: 'Nov 16, 2025', skills: ['ml', 'tensorflow'] },
  { name: 'Set Up an App Dev Environment on Google Cloud', issuer: 'Google Cloud', issued: '2025-11', display: 'Nov 15, 2025', skills: ['cloud'] },
  { name: 'Implement Load Balancing on Compute Engine', issuer: 'Google Cloud', issued: '2025-11', display: 'Nov 9, 2025', skills: ['cloud'] },
  { name: 'Building AI-Powered Search with MongoDB Vector Search', issuer: 'MongoDB', issued: '2025-10', display: 'Oct 31, 2025', skills: ['ai', 'mongodb', 'search'] },
  { name: 'Building RAG Apps Using MongoDB', issuer: 'MongoDB', issued: '2025-10', display: 'Oct 31, 2025', skills: ['mongodb'] },
  {
    name: 'Generative AI', issuer: 'Udacity', issued: '2025-01', display: '2024 – 2025',
    skills: ['genai', 'ai'], format: 'Programme', description: 'Generative AI, large language models and prompt engineering.',
  },
  {
    name: 'Data and AI', issuer: 'Cyber Shujaa', issued: '2025-08', display: 'Aug 2025',
    skills: ['data'], credentialId: 'CS2025-DN2508240728415637', description: 'Data science and artificial intelligence programme.',
  },
  {
    name: 'Leading Young Elevate', issuer: 'Leading Young', issued: '2024-11', display: 'Nov 2024',
    skills: ['leadership'], description: 'A programme that nurtures leadership in young professionals.',
  },
  {
    name: 'AI Career Essentials', issuer: 'ALX Africa', issued: '2024-07', display: 'Jul 2024',
    skills: ['leadership'], description: '8-week course on AI-augmented professional skills for the digital age.',
  },
  {
    name: 'Data Science', issuer: 'Moringa School', issued: '2024-06', display: 'Jun 2024',
    skills: ['data'], description: 'Professional data analysis, visualisation and machine learning.',
  },
  {
    name: 'BSc Strategic Management', issuer: 'Jomo Kenyatta University', issued: '2023-12', display: '2019 – 2023',
    skills: ['leadership'], format: 'Degree · Second Upper',
    description: 'Financial management, business analytics, organisational analysis and business strategy.',
  },
];
