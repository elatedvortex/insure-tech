"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkspaceGreeting } from "@/components/dashboard/WorkspaceGreeting";
import { AttentionStream } from "@/components/dashboard/AttentionStream";
import { ScorePanel } from "@/components/dashboard/ScorePanel";
import { CoveragePanel } from "@/components/dashboard/CoveragePanel";
import { ConversationsPanel } from "@/components/dashboard/ConversationsPanel";
import { DocumentsPanel } from "@/components/dashboard/DocumentsPanel";
import { QuickAsk } from "@/components/dashboard/QuickAsk";
import { useRequireAuth } from "@/lib/auth";
import {
  protectionApi,
  policyApi,
  conversationApi,
  documentApi,
  notificationApi,
  type ProtectionScore,
  type Policy,
  type Conversation,
  type Document,
  type Notification,
} from "@/lib/api";
import type { AttentionItem } from "@/lib/dashboard-data";

// Map a Notification to the AttentionItem shape the component expects
function notifToAttention(n: Notification): AttentionItem {
  return {
    id: n.id,
    kind: "task",
    title: n.title,
    detail: n.body,
    cta: "View",
    href: "/advisor",
    urgency: n.read ? "low" : "high",
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [score, setScore] = useState<ProtectionScore | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setDataLoading(true);
      try {
        const [s, p, c, d, n] = await Promise.allSettled([
          protectionApi.score(),
          policyApi.list(),
          conversationApi.list(),
          documentApi.list(),
          notificationApi.list(),
        ]);
        if (s.status === "fulfilled") setScore(s.value);
        if (p.status === "fulfilled") setPolicies(p.value);
        if (c.status === "fulfilled") setConversations(c.value);
        if (d.status === "fulfilled") setDocuments(d.value);
        if (n.status === "fulfilled") setNotifications(n.value);
      } finally {
        setDataLoading(false);
      }
    }

    load();
  }, [user]);

  if (authLoading) return null;

  const attentionItems = notifications.map(notifToAttention);
  const topItem = attentionItems.find((i) => i.urgency === "high") ?? attentionItems[0];
  const firstName = user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-6 max-w-6xl mx-auto w-full">
        <WorkspaceGreeting name={firstName} topItem={topItem} />

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 pb-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-sage mb-3">
              {attentionItems.length > 0 ? "Needs your attention" : "You're all caught up"}
            </p>
            <AttentionStream items={attentionItems} loading={dataLoading} />
          </div>

          <div className="flex flex-col gap-6">
            <ScorePanel
              overall={score?.overall ?? 0}
              breakdown={score?.breakdown ?? []}
              loading={dataLoading}
            />
            <CoveragePanel policies={policies} loading={dataLoading} />
            <ConversationsPanel conversations={conversations} loading={dataLoading} />
            <DocumentsPanel documents={documents} loading={dataLoading} />
          </div>
        </div>

        <QuickAsk />
      </main>
      
    </>
  );
}
