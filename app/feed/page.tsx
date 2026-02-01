import { characters } from "@/data/characters";
import { getCharacterPreview } from "@/lib/sanitize";
import { FeedClient } from "@/components/FeedClient";
import { TopBar } from "@/components/TopBar";

export default function FeedPage() {
  const previews = characters.map(getCharacterPreview);

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-20 bg-amber-50/70 backdrop-blur">
        <TopBar title="Find a Date" backHref="/" showBrand={false} titleAlign="center" />
      </div>
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-start px-0 pb-[calc(env(safe-area-inset-bottom)+7rem)] pt-3">
        <FeedClient characters={previews} />
      </div>
    </main>
  );
}
