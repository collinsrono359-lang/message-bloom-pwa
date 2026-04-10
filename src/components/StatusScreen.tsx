import { MoreVertical, Camera, Edit3 } from "lucide-react";
import { statusUpdates } from "@/data/mockData";

export default function StatusScreen() {
  const unseen = statusUpdates.filter(s => !s.viewed);
  const seen = statusUpdates.filter(s => s.viewed);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="wa-header px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Status</h1>
          <button className="p-1 rounded-full hover:bg-primary/20 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        {/* My status */}
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-wa-green rounded-full flex items-center justify-center border-2 border-card">
              <span className="text-accent-foreground text-xs font-bold">+</span>
            </span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-[15px] text-foreground">My Status</p>
            <p className="text-sm text-muted-foreground">Tap to add status update</p>
          </div>
        </button>

        {/* Recent updates */}
        {unseen.length > 0 && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent updates</p>
            {unseen.map(s => (
              <button key={s.id} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
                <div className="w-14 h-14 rounded-full p-0.5 bg-wa-green">
                  <img src={s.contact.avatar} alt="" className="w-full h-full rounded-full border-2 border-card" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[15px] text-foreground">{s.contact.name}</p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </div>
              </button>
            ))}
          </>
        )}

        {/* Viewed updates */}
        {seen.length > 0 && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Viewed updates</p>
            {seen.map(s => (
              <button key={s.id} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
                <div className="w-14 h-14 rounded-full p-0.5 bg-muted-foreground/30">
                  <img src={s.contact.avatar} alt="" className="w-full h-full rounded-full border-2 border-card" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[15px] text-foreground">{s.contact.name}</p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* FABs */}
      <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-40">
        <button className="w-11 h-11 bg-secondary rounded-full flex items-center justify-center shadow-md">
          <Edit3 className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg">
          <Camera className="w-6 h-6 text-accent-foreground" />
        </button>
      </div>
    </div>
  );
}
