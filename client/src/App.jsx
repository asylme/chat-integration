import React, { useCallback, useState } from "react";
import ChatForm from "./components/ChatForm";
import ResponseBox from "./components/ResponseBox";
import { sendMessage } from "./services/api";
import { useSpeechToText } from "./hooks/useSpeechToText";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    isSupported: isVoiceSupported,
    isRecording,
    error: voiceError,
    start: startVoiceInput,
    stop: stopVoiceInput,
  } = useSpeechToText({
    onResult: (text) => {
      setMessage((prev) => (prev ? `${prev} ${text}` : text));
    },
    lang: "ru-RU",
  });

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!message.trim()) return;

      try {
        setError("");
        setLoading(true);
        const data = await sendMessage(message);
        setResponse(data.reply || "");
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [message]
  );

  return (
    <main className="grid w-full max-w-[700px] gap-[14px] rounded-[20px] border border-[rgba(103,156,255,0.2)] bg-[#0f3a89] p-6 shadow-[0_12px_35px_rgba(2,8,23,0.35)]">
      <h1 className="m-0 text-[22px] font-semibold text-white">Чат с ИИ</h1>

      <ChatForm
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
        loading={loading}
        isVoiceSupported={isVoiceSupported}
        isRecording={isRecording}
        onVoiceClick={isRecording ? stopVoiceInput : startVoiceInput}
        voiceError={voiceError}
      />

      <ResponseBox response={response} error={error} loading={loading} />
    </main>
  );
}

export default App;
