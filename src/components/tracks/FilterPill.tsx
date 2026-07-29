"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

type FilterPillProps = {
  category?: string;
  type?: string;
  children: React.ReactNode;
};

export function FilterPill({ category, type, children }: FilterPillProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const key = category !== undefined ? "category" : "media";
  const value = category ?? type;
  const currentValue = searchParams.get(key);
  const isActive = category === "all" ? !currentValue : currentValue === value;

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all" || isActive) {
      params.delete(key);
    } else if (value) {
      params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full border-[2px] border-black font-anton text-sm uppercase transition-all ${
        isActive ? "bg-black text-cream" : "bg-cream-light hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}
