"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CampaignForm,
  CampaignFormInitialData,
} from "@/components/campaigns/campaign-form";

function CreateCampaignContent() {
  const searchParams = useSearchParams();

  const initialData: CampaignFormInitialData = {
    campaignName: searchParams.get("name") ?? "",
    callType: searchParams.get("callType") ?? "",
  };

  return <CampaignForm mode="create" initialData={initialData} />;
}

export default function CreateCampaignPage() {
  return (
    <Suspense>
      <CreateCampaignContent />
    </Suspense>
  );
}
