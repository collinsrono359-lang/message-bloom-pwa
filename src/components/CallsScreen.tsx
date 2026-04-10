import { useCallback, useEffect, useRef, useState } from "react";
import { Phone, Video, MoreVertical, PhoneIncoming, PhoneOutgoing, PhoneMissed, Copy, Wifi, X } from "lucide-react";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { toast } from "sonner";
import { contacts, type CallEntry } from "@/data/mockData";
import { logCallToFirestore } from "@/lib/firebaseService";

interface CallsScreenProps {
  callHistory: CallEntry[];
  onLogCall: (call: CallEntry) => void;
}

const ownContact = {
  id: "local-peer",
  name: "You",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=local-peer",
  status: "Ready to call",
  phone: "",
  online: true,
  lastSeen: "now",
};

function DirectionIcon({ direction }: { direction: string }) {
  if (direction === "incoming") return <PhoneIncoming className="w-4 h-4 text-wa-green" />;
  if (direction === "outgoing") return <PhoneOutgoing className="w-4 h-4 text-wa-green" />;
  return <PhoneMissed className="w-4 h-4 text-destructive" />;
}

export default function CallsScreen({ callHistory, onLogCall }: CallsScreenProps) {
  const [peerId, setPeerId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [status, setStatus] = useState("Ready to connect");
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  const [callState, setCallState] = useState<"idle" | "calling" | "in-call">("idle");
  const [latency, setLatency] = useState<number | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [dataConn, setDataConn] = useState<DataConnection | null>(null);
  const [showIncoming, setShowIncoming] = useState(false);
  const peerRef = useRef<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pingRef = useRef<number>(0);

  useEffect(() => {
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("open", id => {
      setPeerId(id);
      setStatus("Peer ready");
    });

    peer.on("error", err => {
      console.error("Peer error", err);
      toast.error(err.message || "Peer connection failed");
      setStatus("Connection error");
    });

    peer.on("connection", conn => {
      conn.on("open", () => {
        setDataConn(conn);
        setStatus("Data channel connected");
        pingConnection(conn);
      });
      conn.on("data", data => handleDataMessage(data, conn));
      conn.on("close", () => {
        setStatus("Data channel closed");
        setLatency(null);
      });
    });

    peer.on("call", async call => {
      setIncomingCall(call);
      setShowIncoming(true);
      setStatus("Incoming call");
    });

    peerRef.current = peer;

    return () => {
      peer.destroy();
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [handleDataMessage]);

  useEffect(() => {
    localStreamRef.current = localStream;
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleDataMessage = useCallback((data: unknown, conn?: DataConnection) => {
    if (typeof data !== "object" || data === null) return;
    const message = data as { type?: string; ts?: number };
    if (message.type === "ping") {
      conn?.send({ type: "pong", ts: message.ts });
    }
    if (message.type === "pong" && typeof message.ts === "number") {
      setLatency(Date.now() - message.ts);
    }
  }, []);

  const pingConnection = (conn: DataConnection) => {
    if (!conn.open) return;
    const now = Date.now();
    pingRef.current = now;
    conn.send({ type: "ping", ts: now });
  };

  const createMediaStream = async (withVideo: boolean) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo });
    setLocalStream(stream);
    return stream;
  };

  const answerCall = async () => {
    if (!incomingCall) return;
    try {
      const stream = await createMediaStream(incomingCall.metadata?.callType === "video");
      incomingCall.answer(stream);
      setCallState("in-call");
      setShowIncoming(false);
      setStatus("In call");
      incomingCall.on("stream", stream => setRemoteStream(stream));
      incomingCall.on("close", endCall);
      incomingCall.on("error", err => { console.error(err); toast.error("Call failed"); endCall(); });
      logLiveCall("incoming");
    } catch (error) {
      console.error(error);
      toast.error("Unable to answer call");
    }
  };

  const connectToPeer = async () => {
    if (!remoteId.trim()) {
      toast.error("Enter remote peer ID to call");
      return;
    }

    const peer = peerRef.current;
    if (!peer) {
      toast.error("Peer is not initialized");
      return;
    }

    try {
      const stream = await createMediaStream(callType === "video");
      const call = peer.call(remoteId, stream, { metadata: { callType } });
      setCallState("calling");
      setStatus(`Calling ${remoteId}...`);
      call.on("stream", stream => {
        setRemoteStream(stream);
        setCallState("in-call");
        setStatus("In call");
      });
      call.on("close", endCall);
      call.on("error", err => { console.error(err); toast.error("Call failed"); endCall(); });

      const conn = peer.connect(remoteId, { reliable: true });
      conn.on("open", () => {
        setDataConn(conn);
        setStatus("Connected");
        pingConnection(conn);
      });
      conn.on("data", handleDataMessage);
      conn.on("close", () => setStatus("Data connection closed"));

      logLiveCall("outgoing");
    } catch (error) {
      console.error(error);
      toast.error("Unable to start call");
      setStatus("Call failed");
    }
  };

  const endCall = () => {
    setCallState("idle");
    setStatus("Ready to connect");
    setLatency(null);
    setRemoteStream(null);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    incomingCall?.close();
    dataConn?.close();
    setIncomingCall(null);
    setDataConn(null);
  };

  const copyPeerId = async () => {
    try {
      await navigator.clipboard.writeText(peerId);
      toast.success("Peer ID copied to clipboard");
    } catch {
      toast.error("Unable to copy Peer ID");
    }
  };

  const logLiveCall = async (direction: "incoming" | "outgoing") => {
    const contact = contacts.find(c => c.id === remoteId) ?? {
      id: remoteId || "unknown",
      name: remoteId ? `Peer ${remoteId.slice(0, 6)}` : "Remote peer",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${remoteId || "peer"}`,
      status: "Available",
      phone: "",
      online: true,
      lastSeen: "now",
    };
    const callEntry: CallEntry = {
      id: `call-${Date.now()}`,
      contact,
      type: callType,
      direction,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      duration: undefined,
    };
    onLogCall(callEntry);
    try {
      await logCallToFirestore(callEntry);
    } catch (error) {
      console.error("Failed to save call log:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="wa-header px-4 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Calls</h1>
          <button className="p-1 rounded-full hover:bg-primary/20 transition-colors" onClick={() => toast.info("Use your Peer ID and a remote Peer ID to connect quickly.") }>
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-card scrollbar-hide px-4 pb-4">
        <div className="rounded-3xl bg-secondary p-4 border border-border/50 space-y-4 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Your peer ID</p>
              <p className="text-xs text-muted-foreground break-all">{peerId || "Generating..."}</p>
            </div>
            <button onClick={copyPeerId} className="rounded-2xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setCallType("audio")} className={`rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${callType === "audio" ? "bg-wa-green text-white" : "bg-background text-foreground"}`}>
              Audio
            </button>
            <button onClick={() => setCallType("video")} className={`rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${callType === "video" ? "bg-wa-green text-white" : "bg-background text-foreground"}`}>
              Video
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em]">Remote peer ID</label>
            <input
              value={remoteId}
              onChange={e => setRemoteId(e.target.value)}
              placeholder="Enter peer ID"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-wa-teal"
            />
          </div>
          <button onClick={connectToPeer} className="w-full rounded-3xl bg-wa-teal px-4 py-3 text-sm font-medium text-white hover:bg-wa-teal/90 transition-colors">
            {callState === "in-call" ? "In call" : callState === "calling" ? "Calling..." : `Start ${callType} call`}
          </button>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{status}</span>
            {latency !== null && <span>Latency: {latency} ms</span>}
          </div>
        </div>

        <div className="rounded-3xl bg-secondary p-4 border border-border/50 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Call history</p>
              <p className="text-xs text-muted-foreground">Recent calls stored in Firebase</p>
            </div>
            <span className="text-xs text-muted-foreground">{callHistory.length} entries</span>
          </div>
          {callHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No call history available yet.</p>
          ) : (
            <div className="space-y-2">
              {callHistory.slice(0, 8).map(call => (
                <div key={call.id} className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border">
                  <img src={call.contact.avatar} alt="" className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{call.contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{call.time} · {call.type}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DirectionIcon direction={call.direction} />
                    {call.duration && <span>{call.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {callType === "video" && (
          <div className="grid gap-3">
            <div className="rounded-3xl bg-background border border-border p-3">
              <p className="text-xs text-muted-foreground mb-2">Local preview</p>
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full rounded-2xl bg-black aspect-video" />
            </div>
            <div className="rounded-3xl bg-background border border-border p-3">
              <p className="text-xs text-muted-foreground mb-2">Remote preview</p>
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-2xl bg-black aspect-video" />
            </div>
          </div>
        )}
      </div>

      {showIncoming && incomingCall && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl p-5 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-base font-semibold text-foreground">Incoming call</p>
                <p className="text-xs text-muted-foreground">From {incomingCall.peer}</p>
              </div>
              <button onClick={() => setShowIncoming(false)} className="p-2 rounded-full hover:bg-secondary/70">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={answerCall} className="flex-1 rounded-3xl bg-wa-green px-4 py-3 text-sm font-medium text-white hover:bg-wa-green/90 transition-colors">Answer</button>
              <button onClick={() => { setShowIncoming(false); setIncomingCall(null); }} className="flex-1 rounded-3xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">Decline</button>
            </div>
          </div>
        </div>
      )}

      {callState === "in-call" && (
        <button onClick={endCall} className="fixed bottom-4 right-4 w-14 h-14 bg-destructive rounded-full flex items-center justify-center shadow-lg z-40">
          <X className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}
