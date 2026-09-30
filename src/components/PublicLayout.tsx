import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import { ChatWidget } from "./ChatWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <ChatWidget />
    </div>
  );
}
