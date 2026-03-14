import React from "react";
import VoiceButton from "./VoiceButton";

function ChatForm({
  message,
  setMessage,
  onSubmit,
  loading,
  isVoiceSupported,
  isRecording,
  onVoiceClick,
  voiceError,
}) {
  return (
    <div className="grid gap-1.5">
      <form
        className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-[18px] border border-[rgba(95,152,255,0.34)] bg-[#0f3a89] p-1.5 shadow-[inset_0_0_0_1px_rgba(173,206,255,0.08)]"
        onSubmit={onSubmit}
      >
        <VoiceButton
          isRecording={isRecording}
          onClick={onVoiceClick}
          disabled={loading}
          isSupported={isVoiceSupported}
        />

        <input
          className="w-full border-0 bg-transparent px-1 text-base leading-none text-[#e9f1ff] outline-none placeholder:text-[rgba(204,222,255,0.7)]"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Спроси меня что угодно"
          disabled={loading}
        />

        <button
          className="grid h-[52px] w-[52px] place-items-center rounded-[14px] border-0 bg-[#215fc8] text-[25px] text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading || !message.trim()}
        >
          {loading ? "..." : ">"}
        </button>
      </form>

      {isRecording ? <p className="m-0 text-[13px] text-[#bdd6ff]">Слушаю...</p> : null}
      {!isVoiceSupported ? (
        <p className="m-0 text-[13px] text-[#c0d7ff]">Голосовой ввод не доступен в этом браузере.</p>
      ) : null}
      {voiceError ? <p className="m-0 text-[13px] text-[#ffb4b4]">{voiceError}</p> : null}
    </div>
  );
}

export default ChatForm;
