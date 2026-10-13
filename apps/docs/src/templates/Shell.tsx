import { useState, type ReactNode } from "react";
import { AppBar, BottomNavigation, Drawer, Icon, IconButton, type NavItem } from "@knowidea/ui";

export const navItems: NavItem[] = [
  { id: "home", label: "ホーム", icon: "home", href: "#home" },
  { id: "list", label: "一覧", icon: "list", href: "#list", count: 3 },
  { id: "calendar", label: "予定", icon: "calendar", href: "#calendar" },
  { id: "settings", label: "設定", icon: "settings", href: "#settings" },
];

interface Props {
  title: string;
  current: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * 画面の骨組み。枠の幅(container query)で組み替える。
 * 広い: 左に Drawer(permanent)。狭い: 上に AppBar と開閉の Drawer、下に BottomNavigation。
 */
export default function Shell({ title, current, meta, actions, children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tpl" onClickCapture={(e) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (a) { e.preventDefault(); setOpen(false); }
    }}>
      <div className="tpl-grid">
        <div className="tpl-side"><Drawer brand={{ name: "見本", sub: "サイドの目次" }} items={navItems} current={current} /></div>
        <div className="tpl-main">
          <AppBar
            title={title}
            headingLevel={2}
            leading={<span className="tpl-menu"><IconButton label="目次を開く" icon={<Icon name="menu" />} onClick={() => setOpen(true)} /></span>}
            meta={meta}
            actions={actions}
          />
          <div className="tpl-content">{children}</div>
          <div className="tpl-bottom"><BottomNavigation items={navItems} current={current} /></div>
        </div>
      </div>
      <Drawer variant="temporary" open={open} onOpenChange={setOpen} brand={{ name: "見本" }} items={navItems} current={current} />
    </div>
  );
}
