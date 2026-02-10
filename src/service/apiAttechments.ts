// services/attachments.api.ts
import { api } from "@/lib/utils";

export async function getUploadUrlApi(payload: {
  fileName: string;
  fileType: string;
}) {
  const res = await api.post("/api/attachments/upload-url", payload);
  return res.data; // { signedUrl, attachmentId }
}

export async function registerAttachmentApi(payload: {
  attachmentId: string;
  fileName: string;
  size: number;
  type: string;
}) {
  const res = await api.post("/api/attachments", payload);
  return res.data;
}
