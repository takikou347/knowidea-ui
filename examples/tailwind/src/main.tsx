import { createRoot } from "react-dom/client";
import { Badge, Button, Icon, StatCard } from "@knowidea/react";
import "./app.css";

function App() {
  return (
    <main className="mx-auto grid max-w-md gap-4 bg-bg p-4 text-text">
      <h1 className="text-5 font-semibold">Tailwind v4 の検査</h1>
      {/* Tailwind の道具クラスは基本のトークン(bg-surface、text-primary、rounded-2 など)で書く */}
      <p className="rounded-2 border border-line bg-surface p-4 text-3 text-text-muted">本文は <code className="font-mono">--color-text-muted</code>。</p>
      <div className="flex flex-wrap gap-3">
        <Button icon={<Icon name="check" />}>主のボタン</Button>
        <Button variant="secondary">副のボタン</Button>
        <Badge tone="info">情報</Badge>
      </div>
      <StatCard label="今日の使用量" icon="usage" value={412300} unit="トークン" delta={{ dir: "up", text: "+12%" }} />
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
