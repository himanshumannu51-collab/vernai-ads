import dynamic from "next/dynamic";
const AIAdGenerator = dynamic(() => import("../components/AIAdGenerator"), {
  ssr: false,
});

export default function GeneratePage() {
  return <AIAdGenerator />;
}
