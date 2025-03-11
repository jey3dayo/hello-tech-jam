// [page.tsx]
import { Suspense } from "react";
import GourmetsClient from "./client";
import { Shop } from "@/types";

async function fetchInitialShops(): Promise<Shop[]> {
  // 内部APIルート（相対パス）
  const relativeUrl = "/api/shops";

  // NEXT_PUBLIC_API_HOSTが設定されていれば、その値を使う
  const host = process.env.NEXT_PUBLIC_API_HOST;
  let url: string;

  if (host && !host.includes("${")) {
    try {
      // URLが有効かチェック。無効な場合は例外が発生するのでキャッチして相対パスを使用
      new URL(`${host}/api/shops`);
      url = `${host}/api/shops`;
    } catch (error) {
      console.error("Invalid NEXT_PUBLIC_API_HOST, using relative path:", error);
      url = relativeUrl;
    }
  } else {
    url = relativeUrl;
  }

  try {
    // cache: "no-store" を指定して最新データを取得（必要に応じて調整）
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch initial shops:", res.status, res.statusText);
      return [];
    }
    return await res.json();
  } catch (error: unknown) {
    console.error("Error fetching initial shops:", error);
    // 接続エラー（ECONNREFUSED など）もここでキャッチし、空配列を返す
    return [];
  }
}

export default async function GourmetsPage() {
  const initialShops = await fetchInitialShops();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GourmetsClient initialShops={initialShops} />
    </Suspense>
  );
}

// import { Suspense } from "react";
// import GourmetsClient from "./client";
// import { Shop } from "@/types";
 
// async function fetchInitialShops(): Promise<Shop[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/shops`);
//   if (!res.ok) {
//     console.error("Failed to fetch initial shops:", res.statusText);
//     return [];
//   }
//   return res.json();
// }
 
// export default async function GourmetsPage() {
//   const initialShops = await fetchInitialShops();
 
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <GourmetsClient initialShops={initialShops} />
//     </Suspense>
//   );
// }