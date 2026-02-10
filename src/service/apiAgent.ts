import { api } from "@/lib/utils";

export type TAgentPayload = {
  // Required fields
  name: string;
  languageId: string;
  voiceId: string;
  promptId: string;
  modelId: string;
  
  // Optional fields - ADD THESE to match the form
  description?: string;
  callType?: string;
  latency?: number;
  speed?: number;
  callScript?: string;
  serviceDescription?: string;
  allowHangup?: boolean;
  allowCallback?: boolean;
  liveTransfer?: boolean;
  attachments?: string[];
};

export interface TAgentResponse {
  id: string;
  name: string;
  languageId: string;
  voiceId: string;
  promptId: string;
  modelId: string;
  description?: string;
  callType?: string;
  latency?: number;
  speed?: number;
  callScript?: string;
  serviceDescription?: string;
  allowHangup?: boolean;
  allowCallback?: boolean;
  liveTransfer?: boolean;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const createAgentApi = async (
  payload: TAgentPayload
): Promise<TAgentResponse> => {
  const response = await api.post<TAgentResponse>("/api/agents", payload);
  return response.data;
};

export const updateAgentApi = async (
  agentId: string,
  payload: TAgentPayload
): Promise<TAgentResponse> => {
  const response = await api.put<TAgentResponse>(`/api/agents/${agentId}`, payload);
  return response.data;
};

export const getAgentApi = async (agentId: string): Promise<TAgentResponse> => {
  const response = await api.get<TAgentResponse>(`/api/agents/${agentId}`);
  return response.data;
};