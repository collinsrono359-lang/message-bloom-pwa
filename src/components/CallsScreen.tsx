import { Phone, Video, MoreVertical, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { callHistory } from "@/data/mockData";

export default function CallsScreen() {
  const DirectionIcon = ({ direction }: { direction: string }) => {
    if (direction === "incoming") return <PhoneIncoming className="w-4 h-4 text-wa-green" />;
    if (direction === "outgoing") return <PhoneOutgoing className="w-4 h-4 text-wa-green" />;
    return <PhoneMissed className="w-4 h-4 text-destructive" />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="wa-header px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Calls</h1>
          <button className="p-1 rounded-full hover:bg-primary/20 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        {/* Create call link */}
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors border-b border-border/50">
          <div className="w-12 h-12 rounded-full bg-wa-green flex items-center justify-center">
            <Phone className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-[15px] text-foreground">Create call link</p>
            <p className="text-sm text-muted-foreground">Share a link for your ChatApp call</p>
          </div>
        </button>

        <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</p>

        {callHistory.map(call => (
          <button key={call.id} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
            <img src={call.contact.avatar} alt="" className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <p className={`font-semibold text-[15px] truncate ${call.direction === "missed" ? "text-destructive" : "text-foreground"}`}>
                {call.contact.name}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <DirectionIcon direction={call.direction} />
                <span>{call.time}</span>
                {call.duration && <span>· {call.duration}</span>}
              </div>
            </div>
            {call.type === "audio" ? (
              <Phone className="w-5 h-5 text-wa-teal flex-shrink-0" />
            ) : (
              <Video className="w-5 h-5 text-wa-teal flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg z-40">
        <Phone className="w-6 h-6 text-accent-foreground" />
      </button>
    </div>
  );
}
