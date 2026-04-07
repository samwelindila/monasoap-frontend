import { useState, useRef, useEffect } from "react";
import logoImage from "../assets/logoc.png"; // Your image is logoc.png

const SUGGESTIONS = [
  "What soaps do you have?",
  "How much does delivery cost?",
  "What are your ingredients?",
  "Do you have gift sets?",
];

const WHATSAPP_LINK = "https://wa.me/255613374380";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BLUE_DARK  = "#0c447c";
const BLUE_MID   = "#185fa5";
const BLUE_LIGHT = "#378add";
const BG_CHAT    = "#f4f9ff";

// Marker so the WhatsApp bubble renders as its own message
const WA_MARKER = "__whatsapp__";

function WaIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.882l6.196-1.448A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.516-5.177-1.415l-.371-.22-3.838.897.962-3.717-.242-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function LogoAvatar({ size = 40 }) {
  return (
    <div style={{
      width: size, 
      height: size, 
      borderRadius: "50%",
      background: "#fff",
      border: "2px solid rgba(55,138,221,0.3)",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      flexShrink: 0, 
      overflow: "hidden", 
      padding: "2px",
    }}>
      <img 
        src={logoImage} 
        alt="Mona" 
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover", 
          borderRadius: "50%" 
        }} 
      />
    </div>
  );
}

function formatMessage(content) {
  const waRegex = /(https:\/\/wa\.me\/[^\s]+)/g;
  if (!waRegex.test(content)) return <span>{content}</span>;
  const parts = content.split(/(https:\/\/wa\.me\/[^\s]+)/);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("https://wa.me/") ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", 
            alignItems: "center", 
            gap: "6px",
            backgroundColor: "#25D366", 
            color: "white", 
            padding: "8px 16px",
            borderRadius: "20px", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "13px", 
            marginTop: "8px",
          }}>
            <WaIcon size={14} /> Chat on WhatsApp
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function WhatsAppBubble() {
  return (
    <div style={{
      maxWidth: "78%",
      background: "#fff",
      border: "1px solid rgba(24,95,165,0.13)",
      borderRadius: "18px 18px 18px 4px",
      padding: "11px 14px",
      display: "flex", 
      flexDirection: "column", 
      gap: "9px",
    }}>
      <p style={{ 
        fontSize: "13px", 
        color: "#0c2d54", 
        lineHeight: "1.55", 
        margin: 0 
      }}>
        Prefer to speak with us directly? We're on WhatsApp anytime 💬
      </p>
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", 
          alignItems: "center", 
          gap: "7px",
          background: "#25D366", 
          color: "#fff",
          padding: "8px 16px", 
          borderRadius: "20px",
          textDecoration: "none", 
          fontSize: "13px", 
          fontWeight: 600,
          width: "fit-content",
        }}
      >
        <WaIcon size={15} /> Chat on WhatsApp
      </a>
    </div>
  );
}

const INITIAL_MESSAGES = [
  { role: "assistant", content: "Karibu MonaSoap! 🌊 I'm Mona, your soap guide. Ask me anything about our handcrafted soaps, ingredients, or delivery." },
  { role: "assistant", content: WA_MARKER },
];

export default function MonaSoapChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { 
      setUnread(0); 
      setTimeout(() => inputRef.current?.focus(), 100); 
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setInput("");
    const updatedMessages = [...messages, { role: "user", content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Strip the WA marker before sending to the API
      const apiMessages = updatedMessages
        .filter(m => m.content !== WA_MARKER)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const reply = data?.reply || `Samahani, something went wrong. Please reach out: ${WHATSAPP_LINK}`;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Oops! Please reach out directly: ${WHATSAPP_LINK} 🌿`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    }
  }

  const isInitialState = messages.length === INITIAL_MESSAGES.length;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(12px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fabFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes ringPulse {
          0%   { transform: scale(0.85); opacity: 0.85; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        @keyframes badgePop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        @keyframes onlinePulse {
          0%,100% { opacity: 1; } 
          50% { opacity: 0.35; }
        }
        @keyframes labelFade {
          from { opacity:0; transform:translateY(4px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .mona-chip:hover { 
          background: #daeaf8 !important; 
          border-color: ${BLUE_LIGHT} !important; 
        }
        .mona-input:focus { 
          border-color: ${BLUE_LIGHT} !important; 
          box-shadow: 0 0 0 3px rgba(55,138,221,0.15) !important; 
          outline: none; 
        }
        .mona-send:hover:not(:disabled) { 
          filter: brightness(1.1); 
        }
        .mona-close:hover { 
          background: rgba(255,255,255,0.28) !important; 
        }
        .mona-fab:hover { 
          transform: translateY(-2px) scale(1.05) !important; 
        }
        .mona-messages::-webkit-scrollbar { 
          width: 4px; 
        }
        .mona-messages::-webkit-scrollbar-thumb { 
          background: rgba(24,95,165,0.2); 
          border-radius: 4px; 
        }
      `}</style>

      {/* ── Chat Panel ── */}
      {open && (
        <div style={{
          position: "fixed", 
          bottom: "104px", 
          right: "24px",
          width: "370px",
          background: "#fff",
          borderRadius: "22px",
          border: "1px solid rgba(24,95,165,0.18)",
          display: "flex", 
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(24,95,165,0.15), 0 2px 8px rgba(24,95,165,0.07)",
          zIndex: 9999,
          animation: "fadeSlideUp 0.3s cubic-bezier(.22,1,.36,1) both",
        }}>

          {/* Header with Image Icon */}
          <div style={{
            background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_MID} 55%, ${BLUE_LIGHT} 100%)`,
            padding: "14px 16px",
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            flexShrink: 0,
          }}>
            {/* Image Icon - LogoAvatar component */}
            <LogoAvatar size={44} />
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 600, 
                color: "#fff", 
                fontSize: "14px" 
              }}>
                Mona
              </div>
              <div style={{ 
                fontSize: "11px", 
                color: "rgba(255,255,255,0.72)", 
                display: "flex", 
                alignItems: "center", 
                gap: "5px", 
                marginTop: "2px" 
              }}>
                <span style={{
                  width: "7px", 
                  height: "7px", 
                  borderRadius: "50%",
                  background: "#4ade80", 
                  display: "inline-block",
                  animation: "onlinePulse 2s ease-in-out infinite",
                }} />
                Online now
              </div>
            </div>
            
            <button
              className="mona-close"
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.18)", 
                border: "none",
                color: "#fff", 
                width: "30px", 
                height: "30px", 
                borderRadius: "50%",
                fontSize: "15px", 
                cursor: "pointer",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="mona-messages" style={{
            flex: 1, 
            overflowY: "auto", 
            padding: "14px",
            background: BG_CHAT,
            display: "flex", 
            flexDirection: "column", 
            gap: "10px",
            maxHeight: "420px",
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end", 
                gap: "7px",
              }}>
                {msg.role === "assistant" && <LogoAvatar size={28} />}

                {msg.content === WA_MARKER ? (
                  <WhatsAppBubble />
                ) : (
                  <div style={{
                    maxWidth: "74%", 
                    padding: "10px 14px",
                    fontSize: "13px", 
                    lineHeight: "1.6",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user"
                      ? `linear-gradient(135deg, ${BLUE_MID} 0%, ${BLUE_LIGHT} 100%)`
                      : "#fff",
                    color: msg.role === "user" ? "#fff" : "#0c2d54",
                    border: msg.role === "assistant" ? "1px solid rgba(24,95,165,0.13)" : "none",
                    wordBreak: "break-word",
                  }}>
                    {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                  </div>
                )}
              </div>
            ))}

            {/* Typing dots */}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "7px" }}>
                <LogoAvatar size={28} />
                <div style={{
                  background: "#fff", 
                  border: "1px solid rgba(24,95,165,0.13)",
                  borderRadius: "18px 18px 18px 4px", 
                  padding: "13px 16px",
                }}>
                  {["0s", "0.2s", "0.4s"].map((delay, i) => (
                    <span key={i} style={{
                      display: "inline-block", 
                      width: "6px", 
                      height: "6px",
                      borderRadius: "50%", 
                      background: BLUE_LIGHT,
                      margin: "0 2px",
                      animation: `bounce 1.2s ease-in-out ${delay} infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion chips — only shown on first open */}
            {isInitialState && !loading && (
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "6px", 
                marginLeft: "35px", 
                marginTop: "2px" 
              }}>
                {SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    className="mona-chip"
                    onClick={() => sendMessage(suggestion)}
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(24,95,165,0.3)",
                      borderRadius: "16px", 
                      padding: "5px 12px",
                      fontSize: "12px", 
                      color: BLUE_MID, 
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(24,95,165,0.1)",
            background: "#fff",
            display: "flex", 
            gap: "8px", 
            alignItems: "center", 
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="mona-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about our soaps…"
              style={{
                flex: 1,
                border: "1px solid rgba(24,95,165,0.25)",
                borderRadius: "20px", 
                padding: "9px 14px",
                fontSize: "13px", 
                background: BG_CHAT,
                color: "#0c2d54", 
                fontFamily: "inherit",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
            <button
              className="mona-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: "38px", 
                height: "38px", 
                borderRadius: "50%",
                background: input.trim() && !loading
                  ? `linear-gradient(135deg, ${BLUE_DARK}, ${BLUE_LIGHT})`
                  : "#d0dde8",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0, 
                transition: "background 0.2s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Bubble ── */}
      <div style={{
        position: "fixed", 
        bottom: "24px", 
        right: "24px",
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        gap: "10px", 
        zIndex: 9999,
      }}>
        {/* Pulse rings */}
        {!open && (
          <>
            <div style={{
              position: "absolute", 
              bottom: "4px", 
              right: "4px",
              width: "64px", 
              height: "64px", 
              borderRadius: "50%",
              border: "2px solid rgba(55,138,221,0.4)",
              animation: "ringPulse 2.4s ease-out infinite",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", 
              bottom: "-4px", 
              right: "-4px",
              width: "80px", 
              height: "80px", 
              borderRadius: "50%",
              border: "1.5px solid rgba(55,138,221,0.2)",
              animation: "ringPulse 2.4s ease-out 0.8s infinite",
              pointerEvents: "none",
            }} />
          </>
        )}

        {/* Label */}
        {!open && (
          <div style={{
            background: `linear-gradient(135deg, ${BLUE_DARK}, ${BLUE_MID})`,
            color: "#fff", 
            fontSize: "12px", 
            fontWeight: 500,
            padding: "5px 14px", 
            borderRadius: "16px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 10px rgba(24,95,165,0.3)",
            animation: "labelFade 0.4s ease 0.2s both",
          }}>
            Chat with Mona ✦
          </div>
        )}

        {/* FAB Button with Image */}
        <button
          className="mona-fab"
          onClick={() => setOpen(v => !v)}
          style={{
            width: "64px", 
            height: "64px", 
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${BLUE_DARK} 0%, ${BLUE_MID} 55%, ${BLUE_LIGHT} 100%)`,
            border: "3px solid #fff",
            cursor: "pointer",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            boxShadow: "0 6px 24px rgba(24,95,165,0.4), 0 0 0 6px rgba(55,138,221,0.12)",
            overflow: "hidden",
            animation: open ? "none" : "fabFloat 3s ease-in-out infinite",
            position: "relative",
            transition: "transform 0.2s",
          }}
        >
          {open ? (
            <span style={{ color: "#fff", fontSize: "20px", lineHeight: 1 }}>✕</span>
          ) : (
            <img
              src={logoImage}
              alt="MonaSoap"
              style={{ 
                width: "58px", 
                height: "58px", 
                objectFit: "cover", 
                borderRadius: "50%" 
              }}
            />
          )}

          {!open && unread > 0 && (
            <div style={{
              position: "absolute", 
              top: "-2px", 
              right: "-2px",
              width: "22px", 
              height: "22px", 
              borderRadius: "50%",
              background: "#ef4444", 
              fontSize: "11px", 
              color: "#fff", 
              fontWeight: 700,
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "2.5px solid #fff",
              animation: "badgePop 0.4s cubic-bezier(.22,1,.36,1) both",
            }}>
              {unread}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}