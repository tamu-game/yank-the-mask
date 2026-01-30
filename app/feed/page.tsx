import { characters } from "@/data/characters";
import { getCharacterPreview } from "@/lib/sanitize";
import { FeedClient } from "@/components/FeedClient";
import { TopBar } from "@/components/TopBar";

export default function FeedPage() {
  const previews = characters.map(getCharacterPreview);

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-20 bg-amber-50/70 backdrop-blur">
        <TopBar title="Find a Vibe" backHref="/" />
      </div>
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+7rem)] pt-6">
        <FeedClient characters={previews} />
      </div>
    </main>
  );
}
