import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MoreVertical, Camera, Edit3, Download } from "lucide-react";
import { statusUpdates, type StatusUpdate } from "@/data/mockData";
import { toast } from "sonner";

interface StatusItem {
  id: string;
  contact: { name: string; avatar: string };
  time: string;
  viewed: boolean;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  fileName?: string;
  blob?: Blob;
}

const MAX_IMAGE_PIXELS = 10_000_000;
const MAX_VIDEO_BYTES = 10 * 1024 * 1024;

function getStatusItem(item: StatusUpdate): StatusItem {
  return {
    id: item.id,
    contact: item.contact,
    time: item.time,
    viewed: item.viewed,
  };
}

async function compressImageFile(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image load failed"));
  });

  let width = image.width;
  let height = image.height;
  const pixels = width * height;
  const scale = pixels > MAX_IMAGE_PIXELS ? Math.sqrt(MAX_IMAGE_PIXELS / pixels) : 1;
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create canvas context");
  ctx.drawImage(image, 0, 0, width, height);
  URL.revokeObjectURL(url);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Image compression failed"));
      }
    }, "image/jpeg", 0.8);
  });
}

export default function StatusScreen() {
  const [statuses, setStatuses] = useState<StatusItem[]>(statusUpdates.map(getStatusItem));
  const [activeStatus, setActiveStatus] = useState<StatusItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const createdUrls = useRef<string[]>([]);

  const openUploader = () => fileInputRef.current?.click();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please choose a photo or video file.");
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      toast.error("Video must be 10MB or smaller.");
      return;
    }

    let mediaUrl: string | undefined;
    try {
      mediaUrl = URL.createObjectURL(file);
      let blob: Blob | undefined = file;
      const mediaType: "image" | "video" = isImage ? "image" : "video";

      if (isImage) {
        const compressed = await compressImageFile(file);
        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        blob = compressed;
        mediaUrl = URL.createObjectURL(compressed);
      }

      if (mediaUrl) {
        createdUrls.current.push(mediaUrl);
      }

      const newStatus: StatusItem = {
        id: `new-${Date.now()}`,
        contact: { name: "You", avatar: "/avatars/default.png" },
        time: "Just now",
        viewed: false,
        mediaType,
        mediaUrl,
        fileName: file.name,
        blob,
      };

      setStatuses(prev => [newStatus, ...prev]);
      toast.success(`${isImage ? "Photo" : "Video"} status added`);
    } catch (error) {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
      console.error(error);
      toast.error("Unable to upload status. Please try a different file.");
    }
  };

  const handleDownload = (status: StatusItem) => {
    if (!status.mediaUrl || !status.fileName) {
      toast.error("No media available to download.");
      return;
    }

    const link = document.createElement("a");
    link.href = status.mediaUrl;
    link.download = status.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Preparing your compressed download...");
  };

  useEffect(() => {
    const urls = createdUrls.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const unseen = statuses.filter(s => !s.viewed);
  const seen = statuses.filter(s => s.viewed);

  return (
    <div className="flex flex-col h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="wa-header px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Status</h1>
          <button className="p-1 rounded-full hover:bg-primary/20 transition-colors" onClick={() => toast.info("Status updates let your contacts see photos or videos for 24 hours.") }>
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide">
        <button onClick={openUploader} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors">
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
            <p className="text-sm text-muted-foreground">Tap to add a photo or video. Images are compressed to 10MP and videos are limited to 10MB.</p>
          </div>
        </button>

        {unseen.length > 0 && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent updates</p>
            {unseen.map(s => (
              <button key={s.id} onClick={() => setActiveStatus(s)} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors text-left">
                <div className={`w-14 h-14 rounded-full p-0.5 ${s.mediaType ? "bg-wa-green" : "bg-wa-teal"}`}>
                  <img src={s.contact.avatar} alt="" className="w-full h-full rounded-full border-2 border-card" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[15px] text-foreground">{s.contact.name}</p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </div>
                {s.mediaType && <span className="text-xs text-wa-teal uppercase">{s.mediaType}</span>}
              </button>
            ))}
          </>
        )}

        {seen.length > 0 && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Viewed updates</p>
            {seen.map(s => (
              <button key={s.id} onClick={() => setActiveStatus(s)} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary/60 transition-colors text-left">
                <div className="w-14 h-14 rounded-full p-0.5 bg-muted-foreground/30">
                  <img src={s.contact.avatar} alt="" className="w-full h-full rounded-full border-2 border-card" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[15px] text-foreground">{s.contact.name}</p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </div>
                {s.mediaType && <span className="text-xs text-muted-foreground uppercase">{s.mediaType}</span>}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-40">
        <button onClick={openUploader} className="w-11 h-11 bg-secondary rounded-full flex items-center justify-center shadow-md">
          <Edit3 className="w-5 h-5 text-muted-foreground" />
        </button>
        <button onClick={openUploader} className="w-14 h-14 bg-wa-green rounded-full flex items-center justify-center shadow-lg">
          <Camera className="w-6 h-6 text-accent-foreground" />
        </button>
      </div>

      {activeStatus && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-card overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div>
                <p className="text-sm font-semibold text-foreground">{activeStatus.contact.name}</p>
                <p className="text-xs text-muted-foreground">{activeStatus.time}</p>
              </div>
              <button onClick={() => setActiveStatus(null)} className="text-sm text-wa-teal">Close</button>
            </div>
            <div className="p-4">
              {activeStatus.mediaType === "image" && activeStatus.mediaUrl ? (
                <img src={activeStatus.mediaUrl} alt="Status" className="w-full rounded-3xl object-contain" />
              ) : activeStatus.mediaType === "video" && activeStatus.mediaUrl ? (
                <video controls src={activeStatus.mediaUrl} className="w-full rounded-3xl" />
              ) : (
                <div className="rounded-3xl bg-secondary p-8 text-center text-sm text-muted-foreground">No preview available for this status.</div>
              )}
            </div>
            {activeStatus.mediaUrl && (
              <div className="flex gap-3 px-4 pb-4">
                <button onClick={() => handleDownload(activeStatus)} className="flex-1 rounded-2xl bg-wa-teal px-4 py-3 text-sm font-medium text-white hover:bg-wa-teal/90 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
