import { api } from "@/lib/utils";


export type TLanguage = {
  id: string;
  name: string;
  code: string;
};

export type TVoice = {
  id: string;
  name: string;
  tag: string;
};

export type TPrompt = {
  id: string;
  name: string;
};

export type TModel = {
  id: string;
  name: string;
};


export async function getLanguagesApi(): Promise<TLanguage[]> {
  const res = await api.get("/api/languages");
  return res.data;
}

export async function getVoicesApi(): Promise<TVoice[]> {
  const res = await api.get("/api/voices");
  return res.data;
}

export async function getPromptsApi(): Promise<TPrompt[]> {
  const res = await api.get("/api/prompts");
  return res.data;
}

export async function getModelsApi(): Promise<TModel[]> {
  const res = await api.get("/api/models");
  return res.data;
}
