"use client";

import { useParams } from "next/navigation";
import { campaigns } from "@/data/campaigns";
import { customers } from "@/data/customers";
import { agents } from "@/data/agents";
import {
  CampaignForm,
  CampaignFormInitialData,
} from "@/components/campaigns/campaign-form";

export default function EditCampaignPage() {
  const { id } = useParams<{ id: string }>();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground">Campaign not found.</p>
      </div>
    );
  }

  // Resolve list and agent names back to IDs for the select dropdowns
  const customerMatch = customers.find((c) => c.name === campaign.list);
  const agentMatch = agents.find((a) => a.name === campaign.agent);

  const initialData: CampaignFormInitialData = {
    campaignName: campaign.name,
    callType: campaign.status === "running" ? "outbound" : "outbound",
    list: customerMatch?.id ?? "",
    agent: agentMatch?.id ?? "",
  };

  return <CampaignForm mode="edit" initialData={initialData} />;
}
