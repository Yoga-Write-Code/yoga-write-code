export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  website_url: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type WebsiteAnalysis = {
  id: string;
  project_id: string;
  company_summary: string;
  product_category: string;
  target_audience: string;
  positioning: string;
  raw_data: Record<string, unknown>;
  created_at: string;
};

export type ContentOpportunity = {
  id: string;
  project_id: string;
  analysis_id?: string | null;
  title: string;
  description: string;
  opportunity_score: number;
  difficulty: string;
  business_relevance?: string | null;
  search_intent: string;
  funnel_stage: string;
  reason: string;
  created_at: string;
};

export type TopicCluster = {
  id: string;
  project_id: string;
  opportunity_id?: string | null;
  pillar_topic: string;
  supporting_topics: string[];
  search_intent: string;
  priority: string;
  internal_linking_suggestions: string[];
  created_at: string;
};

export type SeoBrief = {
  id: string;
  project_id: string;
  opportunity_id?: string | null;
  primary_keyword: string;
  search_intent: string;
  target_audience: string;
  suggested_headings: string[];
  questions_to_answer: string[];
  entities_to_mention: string[];
  competitor_insights: string[];
  created_at: string;
};

export type ArticleOutlineSection = {
  heading: string;
  points: string[];
};

export type ArticleOutline = {
  id: string;
  project_id: string;
  opportunity_id?: string | null;
  title: string;
  h1: string;
  sections: ArticleOutlineSection[];
  created_at: string;
};