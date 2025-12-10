// Types matching the backend API response

export interface Company {
  name: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  logo?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  experienceLevel: string;
  jobUrl: string;
  salary?: {
    min: number;
    max: number;
  };
  matchScore?: number;
}

export interface CompanyOverviewResponse {
  success: boolean;
  data: {
    company: Company;
    jobs: Job[];
  };
}

export interface JobDetailsResponse {
  success: boolean;
  data: Job;
}
