import { Suspense } from "react";
import { InquiriesPanel } from "@/components/admin/InquiriesPanel";

// お問い合わせ一覧を常に最新の状態で表示するため動的レンダリングにする
export const dynamic = "force-dynamic";

export default function InquiriesPage() {
  return (
    <Suspense>
      <InquiriesPanel />
    </Suspense>
  );
}
