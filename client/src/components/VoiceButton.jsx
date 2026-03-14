import React from "react";
import MicIcon from "./MicIcon";

function VoiceButton({ isRecording, onClick, disabled = false, isSupported = true }) {
  return (
    <button
      className={`grid h-[52px] w-[52px] place-items-center rounded-[14px] text-2xl text-white disabled:cursor-not-allowed disabled:opacity-60 ${
        isRecording ? "bg-[#b91c1c]" : "bg-[rgba(28,78,168,0.84)]"
      }`}
      type="button"
      onClick={onClick}
      disabled={!isSupported || disabled}
      aria-label={isRecording ? "Остановить запись" : "Начать запись"}
      title={isSupported ? "Голосовой ввод" : "Голосовой ввод не доступен"}
    >
      <MicIcon />
    </button>
  );
}

export default VoiceButton;
