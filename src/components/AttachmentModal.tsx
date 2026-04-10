import { X, Image, Video, FileText, MapPin, Contact, Gift } from "lucide-react";

interface AttachmentModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const attachments = [
  { id: "image", label: "Image", icon: Image, color: "bg-purple-500" },
  { id: "video", label: "Video", icon: Video, color: "bg-red-500" },
  { id: "document", label: "Document", icon: FileText, color: "bg-blue-500" },
  { id: "location", label: "Location", icon: MapPin, color: "bg-green-500" },
  { id: "contact", label: "Contact", icon: Contact, color: "bg-wa-teal" },
  { id: "gif", label: "GIF", icon: Gift, color: "bg-orange-500" },
];

export default function AttachmentModal({ open, onClose, onSelect }: AttachmentModalProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute bottom-16 left-2 right-2 z-40 bg-card rounded-2xl shadow-2xl border border-border p-4 animate-slide-up">
        <div className="grid grid-cols-3 gap-4">
          {attachments.map(att => (
            <button
              key={att.id}
              onClick={() => { onSelect(att.id); onClose(); }}
              className="flex flex-col items-center gap-2 py-3 rounded-xl hover:bg-secondary/60 transition-colors"
            >
              <div className={`w-12 h-12 ${att.color} rounded-full flex items-center justify-center shadow-md`}>
                <att.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-foreground font-medium">{att.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
