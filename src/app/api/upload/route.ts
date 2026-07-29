import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_CONTENT_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "video/mp4",
  "video/quicktime",
];

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const correctPassword = process.env.UPLOAD_PASSWORD;
        if (!correctPassword) {
          throw new Error("UPLOAD_PASSWORD が環境変数に設定されていません。");
        }
        if (clientPayload !== correctPassword) {
          throw new Error("パスワードが違います。");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          addRandomSuffix: true,
          tokenPayload: pathname,
        };
      },
      onUploadCompleted: async () => {
        // アップロード完了時のフック（現状は特に処理なし）
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
