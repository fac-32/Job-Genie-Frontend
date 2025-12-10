import axios from 'axios';
import type { CompanyOverviewResponse, JobDetailsResponse, Job } from '../types/company.types';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetches company overview including company info and jobs
 * @param companyName - Name of the company (e.g., "Google")
 * @returns Company data with jobs
 */
export async function getCompanyOverview(
  companyName: string
): Promise<CompanyOverviewResponse> {
  try {
    const response = await axios.get<CompanyOverviewResponse>(
      `${API_BASE_URL}/companies/${companyName}/overview`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch company overview: ${error.response?.data?.error || error.message}`
      );
    }
    throw error;
  }
}

/**
 * Fetches jobs for a specific company
 * @param companyName - Name of the company
 * @returns Array of jobs
 */
export async function getCompanyJobs(companyName: string): Promise<Job[]> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/companies/${companyName}/jobs`
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch jobs: ${error.response?.data?.error || error.message}`
      );
    }
    throw error;
  }
}

/**
 * Fetches specific job details by ID
 * @param companyName - Name of the company
 * @param jobId - ID of the job
 * @returns Job details
 */
export async function getJobDetails(
  companyName: string,
  jobId: string
): Promise<JobDetailsResponse> {
  try {
    const response = await axios.get<JobDetailsResponse>(
      `${API_BASE_URL}/companies/${companyName}/jobs/${jobId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch job details: ${error.response?.data?.error || error.message}`
      );
    }
    throw error;
  }
}
