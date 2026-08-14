import { NextResponse } from "next/server";
import { getMux } from "@/lib/mux";
import { getMediaOverride, setMediaOverride } from "@/lib/blobMetadata";

function checkPassword(password: string | null | undefined) {
  return Boolean(process.env.UPLOAD_PASSWORD) && password === process.env.UPLOAD_PASSWORD;
}

// 動画をMuxに登録し、HLSへのトランスコードを開始する（既存のBlob URLをそのまま渡すので再アップロード不要）
export async function POST(request: Request) {
  const body = await request.json();
  const { pathname, url, password } = body as { pathname?: string; url?: string; password?: string };

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }
  if (!pathname || !url) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const asset = await getMux().video.assets.create({
    inputs: [{ url }],
    playback_policy: ["public"],
    video_quality: "basic",
  });

  const current = await getMediaOverride(pathname);
  await setMediaOverride(pathname, {
    ...current,
    muxAssetId: asset.id,
    muxPlaybackId: asset.playback_ids?.[0]?.id,
    muxStatus: asset.status === "ready" ? "ready" : "preparing",
  });

  return NextResponse.json({ assetId: asset.id, status: asset.status });
}

// トランスコード状況をポーリングし、準備完了/失敗になったらMediaOverrideに反映する
export async function GET(request: Request) {
  const url = new URL(request.url);
  const password = url.searchParams.get("password");
  const pathname = url.searchParams.get("pathname");

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }
  if (!pathname) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const current = await getMediaOverride(pathname);
  if (!current.muxAssetId) {
    return NextResponse.json({ status: null });
  }
  if (current.muxStatus === "ready" || current.muxStatus === "errored") {
    return NextResponse.json({ status: current.muxStatus, playbackId: current.muxPlaybackId ?? null });
  }

  const asset = await getMux().video.assets.retrieve(current.muxAssetId);
  const playbackId = asset.playback_ids?.[0]?.id;
  const status: "preparing" | "ready" | "errored" =
    asset.status === "ready" ? "ready" : asset.status === "errored" ? "errored" : "preparing";

  if (status === "ready" || status === "errored") {
    await setMediaOverride(pathname, { ...current, muxStatus: status, muxPlaybackId: playbackId });
  }

  return NextResponse.json({ status, playbackId: playbackId ?? null });
}
