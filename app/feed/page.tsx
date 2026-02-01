import { characters } from "@/data/characters";
import { getCharacterPreview } from "@/lib/sanitize";
import { FeedClient } from "@/components/FeedClient";
import { TopBar } from "@/components/TopBar";
import { BackgroundAudio } from "@/components/BackgroundAudio";

export default function FeedPage() {
  const previews = characters.map(getCharacterPreview);

  return (
    <main className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-20 flex justify-center">
        <div className="relative w-[390px] bg-amber-50/70 backdrop-blur">
          <TopBar title="Find a Date" backHref="/" showBrand={false} titleAlign="center" />
          <BackgroundAudio />
        </div>
      </div>
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-start px-0 pb-[calc(env(safe-area-inset-bottom)+7rem)] pt-[calc(72px+0.75rem)]">
        <FeedClient characters={previews} />
      </div>
    </main>
  );
}
