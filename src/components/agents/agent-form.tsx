"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ChevronDown,
  Upload,
  X,
  FileText,
  Phone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getLanguagesApi,
  getModelsApi,
  getPromptsApi,
  getVoicesApi,
  TLanguage,
  TModel,
  TPrompt,
  TVoice,
} from "@/service/apiLookups";
import {
  getUploadUrlApi,
  registerAttachmentApi,
} from "@/service/apiAttechments";
import {
  createAgentApi,
  TAgentPayload,
  updateAgentApi,
} from "@/service/apiAgent";
import { api } from "@/lib/utils";
import toast from "react-hot-toast";

interface UploadedFile {
  name: string;
  size: number;
  file: File;
  status: "idle" | "uploading" | "success" | "error";
  attachmentId?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function CollapsibleSection({
  title,
  description,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  badge?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="mt-1">
                    {description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {badge !== undefined && badge > 0 && (
                  <Badge variant="destructive">{badge} required</Badge>
                )}
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""
                    }`}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <CardContent className="pt-6">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export interface AgentFormInitialData {
  id?: string;
  agentName?: string;
  description?: string;
  callType?: string;
  languageId?: string;
  voiceId?: string;
  promptId?: string;
  modelId?: string;
  latency?: number;
  speed?: number;
  callScript?: string;
  serviceDescription?: string;
  allowHangup?: boolean;
  allowCallback?: boolean;
  liveTransfer?: boolean;
  attachments?: string[];
}

interface AgentFormProps {
  mode: "create" | "edit";
  initialData?: AgentFormInitialData;
}

export function AgentForm({ mode, initialData }: AgentFormProps) {
  // Form state
  const [agentName, setAgentName] = useState(initialData?.agentName ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [callType, setCallType] = useState(initialData?.callType ?? "");
  const [callScript, setCallScript] = useState(initialData?.callScript ?? "");
  const [serviceDescription, setServiceDescription] = useState(
    initialData?.serviceDescription ?? ""
  );
  const [latency, setLatency] = useState([initialData?.latency ?? 0.5]);
  const [speed, setSpeed] = useState([initialData?.speed ?? 110]);

  // API data state
  const [languages, setLanguages] = useState<TLanguage[]>([]);
  const [voices, setVoices] = useState<TVoice[]>([]);
  const [prompts, setPrompts] = useState<TPrompt[]>([]);
  const [models, setModels] = useState<TModel[]>([]);
  const [loading, setLoading] = useState(false);

  // Form selections
  const [form, setForm] = useState({
    languageId: initialData?.languageId ?? "",
    voiceId: initialData?.voiceId ?? "",
    promptId: initialData?.promptId ?? "",
    modelId: initialData?.modelId ?? "",
  });

  // Tools state
  const [allowHangup, setAllowHangup] = useState(
    initialData?.allowHangup ?? false
  );
  const [allowCallback, setAllowCallback] = useState(
    initialData?.allowCallback ?? false
  );
  const [liveTransfer, setLiveTransfer] = useState(
    initialData?.liveTransfer ?? false
  );

  // Agent state
  const [agentId, setAgentId] = useState<string | null>(
    initialData?.id ?? null
  );
  const [saving, setSaving] = useState(false);

  // Reference Data
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test Call
  const [testFirstName, setTestFirstName] = useState("");
  const [testLastName, setTestLastName] = useState("");
  const [testGender, setTestGender] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testCallLoading, setTestCallLoading] = useState(false);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update Form helper
  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Track changes in form fields
  useEffect(() => {
    if (mode === "create" && !agentId) {
      // For create mode, any input means unsaved changes
      const hasData = agentName || description || callType || callScript || serviceDescription;
      setHasUnsavedChanges(!!hasData);
    }
  }, [agentName, description, callType, callScript, serviceDescription, mode, agentId]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Fetch lookups on mount
  useEffect(() => {
    let isMounted = true;

    const fetchLookups = async () => {
      setLoading(true);
      try {
        const [languagesRes, voicesRes, promptsRes, modelsRes] =
          await Promise.all([
            getLanguagesApi(),
            getVoicesApi(),
            getPromptsApi(),
            getModelsApi(),
          ]);

        if (!isMounted) return;

        setLanguages(languagesRes);
        setVoices(voicesRes);
        setPrompts(promptsRes);
        setModels(modelsRes);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch lookups:", error);
          toast.error("Failed to load form data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLookups();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load initial attachments if in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData?.attachments && initialData.attachments.length > 0) {
      // Note: In a real app, you'd fetch attachment details from the API
      // For now, we just mark them as already uploaded
      const existingFiles: UploadedFile[] = initialData.attachments.map((attId) => ({
        name: `Attachment ${attId}`,
        size: 0,
        file: new File([], ""),
        status: "success" as const,
        attachmentId: attId,
      }));
      setUploadedFiles(existingFiles);
    }
  }, [mode, initialData]);

  // File upload handlers
  const ACCEPTED_TYPES = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".csv",
    ".xlsx",
    ".xls",
  ];

  const uploadFile = useCallback(
    async (fileItem: UploadedFile, index: number) => {
      try {
        const { signedUrl, attachmentId } = await getUploadUrlApi({
          fileName: fileItem.name,
          fileType: fileItem.file.type,
        });

        setUploadedFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "uploading", attachmentId } : f
          )
        );

        await fetch(signedUrl, {
          method: "PUT",
          body: fileItem.file,
          headers: {
            "Content-Type": fileItem.file.type,
          },
        });

        await registerAttachmentApi({
          attachmentId,
          fileName: fileItem.name,
          size: fileItem.size,
          type: fileItem.file.type,
        });

        setUploadedFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, status: "success" } : f))
        );

        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadedFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, status: "error" } : f))
        );
        toast.error(`Failed to upload ${fileItem.name}`);
      }
    },
    []
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newFiles.push({
          name: file.name,
          size: file.size,
          file,
          status: "idle",
        });
      }

      setUploadedFiles((prev) => {
        const updated = [...prev, ...newFiles];
        newFiles.forEach((file, idx) => {
          uploadFile(file, prev.length + idx);
        });
        return updated;
      });
    },
    [uploadFile]
  );

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSaveAgent = async () => {
    console.log(" Starting save process...");

    // Validation
    if (!agentName.trim()) {
      toast.error("Agent name is required");
      return;
    }
    if (!callType) {
      toast.error("Call type is required");
      return;
    }
    if (!form.languageId) {
      toast.error("Language is required");
      return;
    }
    if (!form.voiceId) {
      toast.error("Voice is required");
      return;
    }
    if (!form.promptId) {
      toast.error("Prompt is required");
      return;
    }
    if (!form.modelId) {
      toast.error("Model is required");
      return;
    }

    console.log(" Validation passed");

    setSaving(true);

    try {
      const uploadedAttachmentIds = uploadedFiles
        .filter((f) => f.status === "success" && f.attachmentId)
        .map((f) => f.attachmentId!);

      console.log("📎 Uploaded attachments:", uploadedAttachmentIds);

      const agentPayload: TAgentPayload = {
        name: agentName,
        description: description || undefined,
        callType: callType || undefined,
        languageId: form.languageId,
        voiceId: form.voiceId,
        promptId: form.promptId,
        modelId: form.modelId,
        latency: latency[0],
        speed: speed[0],
        callScript: callScript || undefined,
        serviceDescription: serviceDescription || undefined,
        allowHangup,
        allowCallback,
        liveTransfer,
        attachments: uploadedAttachmentIds,
      };

      let res;

      if (agentId) {
        res = await updateAgentApi(agentId, agentPayload);
      } else {
        res = await createAgentApi(agentPayload);
      }

      console.log(" API Response:", res);

      if (!agentId && res?.id) {
        setAgentId(res.id);
        console.log("🆔 New agent ID set:", res.id);
      }

      // Reset unsaved changes flag after successful save
      setHasUnsavedChanges(false);

      toast.success(
        mode === "create"
          ? "Agent created successfully"
          : "Agent updated successfully"
      );

      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(" Save failed - Full error:", error);
      console.error(" Error name:", error?.name);
      console.error(" Error message:", error?.message);
      console.error(" Error response:", error?.response);
      console.error(" Error response data:", error?.response?.data);
      console.error(" Error status:", error?.response?.status);
      console.error(" Error stack:", error?.stack);

      // Extract error message
      let errorMessage = "Failed to save agent";

      if (error?.response?.data) {
        // API error with response
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error?.message) {
        // Generic error message
        errorMessage = error.message;
      }

      console.error(" Final error message:", errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setSaving(false);
      console.log(" Save process completed");
    }
  };

  const handleTestCall = async () => {
    console.log(" Starting test call...");

    // Validation
    if (!testPhone) {
      toast.error("Phone number is required for test call");
      return;
    }

    setTestCallLoading(true);

    try {
      // Step 1: If no agentId exists OR there are unsaved changes, save first
      let currentAgentId = agentId;

      if (!currentAgentId || hasUnsavedChanges) {
        console.log(" Saving agent before test call...");
        const savedAgent = await handleSaveAgent();
        currentAgentId = savedAgent?.id || agentId;

        if (!currentAgentId) {
          toast.error("Failed to save agent before test call");
          return;
        }
      }

      console.log(" Initiating test call for agent:", currentAgentId);

      // Step 2: Make the test call API request against the mock API server
      const response = await api.post(`/api/agents/${currentAgentId}/test-call`, {
        firstName: testFirstName || undefined,
        lastName: testLastName || undefined,
        gender: testGender || undefined,
        phoneNumber: testPhone,
      });

      const result = response.data;

      console.log(" Test call initiated:", result);

      toast.success(
        `Test call initiated successfully! Call ID: ${result.callId}`,
        { duration: 5000 }
      );

      // Optionally clear the test form
      // setTestFirstName("");
      // setTestLastName("");
      // setTestGender("");
      // setTestPhone("");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(" Test call failed:", error);

      let errorMessage = "Failed to start test call";

      if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setTestCallLoading(false);
      console.log(" Test call process completed");
    }
  };

  // Badge counts for required fields
  const basicSettingsMissing = [
    agentName,
    callType,
    form.languageId,
    form.voiceId,
    form.promptId,
    form.modelId,
  ].filter((v) => !v).length;

  const heading = mode === "create" ? "Create Agent" : "Edit Agent";
  const saveLabel = mode === "create" ? "Save Agent" : "Save Changes";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{heading}</h1>
          {hasUnsavedChanges && (
            <p className="text-sm text-muted-foreground mt-1">
              You have unsaved changes
            </p>
          )}
        </div>
        <Button onClick={handleSaveAgent} disabled={saving}>
          {saving ? "Saving..." : saveLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Collapsible Sections */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Section 1: Basic Settings */}
          <CollapsibleSection
            title="Basic Settings"
            description="Add some information about your agent to get started."
            badge={basicSettingsMissing}
            defaultOpen
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">
                  Agent Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="agent-name"
                  placeholder="e.g. Sales Assistant"
                  value={agentName}
                  onChange={(e) => {
                    setAgentName(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe what this agent does..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Call Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={callType}
                  onValueChange={(value) => {
                    setCallType(value);
                    setHasUnsavedChanges(true);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select call type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">
                      Inbound (Receive Calls)
                    </SelectItem>
                    <SelectItem value="outbound">
                      Outbound (Make Calls)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Language <span className="text-destructive">*</span>
                </Label>

                <Select
                  value={form.languageId}
                  onValueChange={(value) => updateForm("languageId", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading && (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Voice <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.voiceId}
                  onValueChange={(value) => updateForm("voiceId", value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading && (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div className="flex items-center gap-2">
                          <span>{voice.name}</span>
                          {voice.tag && (
                            <Badge variant="secondary" className="text-xs">
                              {voice.tag}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Prompt <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.promptId}
                  onValueChange={(value) => updateForm("promptId", value)}
                  disabled={loading}
                >
                  <SelectTrigger className=" w-full">
                    <SelectValue placeholder="Select prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading && (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                    {prompts.map((prompt) => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Model <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.modelId}
                  onValueChange={(value) => updateForm("modelId", value)}
                  disabled={loading}
                >
                  <SelectTrigger className=" w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading && (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    )}
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latency ({latency[0].toFixed(1)}s)</Label>
                  <Slider
                    value={latency}
                    onValueChange={(value) => {
                      setLatency(value);
                      setHasUnsavedChanges(true);
                    }}
                    min={0.3}
                    max={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.3s</span>
                    <span>1.0s</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Speed ({speed[0]}%)</Label>
                  <Slider
                    value={speed}
                    onValueChange={(value) => {
                      setSpeed(value);
                      setHasUnsavedChanges(true);
                    }}
                    min={90}
                    max={130}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>90%</span>
                    <span>130%</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 2: Call Script */}
          <CollapsibleSection
            title="Call Script"
            description="What would you like the AI agent to say during the call?"
          >
            <div className="space-y-2">
              <Textarea
                placeholder="Write your call script here..."
                value={callScript}
                onChange={(e) => {
                  setCallScript(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                rows={6}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {callScript.length}/20000
              </p>
            </div>
          </CollapsibleSection>

          {/* Section 3: Service/Product Description */}
          <CollapsibleSection
            title="Service/Product Description"
            description="Add a knowledge base about your service or product."
          >
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your service or product..."
                value={serviceDescription}
                onChange={(e) => {
                  setServiceDescription(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                rows={6}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {serviceDescription.length}/20000
              </p>
            </div>
          </CollapsibleSection>

          {/* Section 4: Reference Data */}
          <CollapsibleSection
            title="Reference Data"
            description="Enhance your agent's knowledge base with uploaded files."
          >
            <div className="space-y-4">
              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">
                  Drag & drop files here, or{" "}
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepted: .pdf, .doc, .docx, .txt, .csv, .xlsx, .xls
                </p>
              </div>

              {uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {uploadedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm truncate">{f.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatFileSize(f.size)}
                        </span>

                        {f.status === "uploading" && (
                          <Badge variant="secondary">Uploading…</Badge>
                        )}
                        {f.status === "success" && (
                          <Badge variant="default">Uploaded</Badge>
                        )}
                        {f.status === "error" && (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        disabled={f.status === "uploading"}
                        onClick={() => removeFile(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <FileText className="h-10 w-10 mb-2" />
                  <p className="text-sm">No Files Available</p>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Section 5: Tools */}
          <CollapsibleSection
            title="Tools"
            description="Tools that allow the AI agent to perform call-handling actions and manage session control."
          >
            <FieldGroup className="w-full">
              <FieldLabel htmlFor="switch-hangup">
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldTitle>Allow hang up</FieldTitle>
                    <FieldDescription>
                      Select if you would like to allow the agent to hang up
                      the call
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="switch-hangup"
                    checked={allowHangup}
                    onCheckedChange={(checked) => {
                      setAllowHangup(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="switch-callback">
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldTitle>Allow callback</FieldTitle>
                    <FieldDescription>
                      Select if you would like to allow the agent to make
                      callbacks
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="switch-callback"
                    checked={allowCallback}
                    onCheckedChange={(checked) => {
                      setAllowCallback(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="switch-transfer">
                <Field orientation="horizontal" className="items-center">
                  <FieldContent>
                    <FieldTitle>Live transfer</FieldTitle>
                    <FieldDescription>
                      Select if you want to transfer the call to a human agent
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="switch-transfer"
                    checked={liveTransfer}
                    onCheckedChange={(checked) => {
                      setLiveTransfer(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </Field>
              </FieldLabel>
            </FieldGroup>
          </CollapsibleSection>
        </div>

        {/* Right Column — Sticky Test Call Card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Test Call
                </CardTitle>
                <CardDescription>
                  Make a test call to preview your agent. Each test call will
                  deduct credits from your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="test-first-name">First Name</Label>
                      <Input
                        id="test-first-name"
                        placeholder="John"
                        value={testFirstName}
                        onChange={(e) => setTestFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-last-name">Last Name</Label>
                      <Input
                        id="test-last-name"
                        placeholder="Doe"
                        value={testLastName}
                        onChange={(e) => setTestLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={testGender} onValueChange={setTestGender}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test-phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <PhoneInput
                      defaultCountry="EG"
                      value={testPhone}
                      onChange={(value) => setTestPhone(value)}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleTestCall}
                    disabled={testCallLoading || !testPhone}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {testCallLoading ? "Initiating Call..." : "Start Test Call"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-background px-6 py-4">
        <div className="flex justify-end gap-3">
          {hasUnsavedChanges && (
            <p className="text-sm text-muted-foreground my-auto">
              You have unsaved changes
            </p>
          )}
          <Button onClick={handleSaveAgent} disabled={saving}>
            {saving ? "Saving..." : saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}