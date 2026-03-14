import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechToText({ onResult, lang = "ru-RU" }) {
  const recognitionRef = useRef(null);
  const isManualStopRef = useRef(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setError("");
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() ?? "";
      if (transcript) {
        setError("");
        onResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      // "aborted" is expected after manual stop in many browsers.
      if (event.error === "aborted" && isManualStopRef.current) {
        return;
      }
      if (event.error === "not-allowed") {
        setError("Доступ к микрофону запрещен.");
        return;
      }
      if (event.error === "audio-capture") {
        setError("Микрофон недоступен.");
        return;
      }
      if (event.error === "no-speech") {
        setError("Речь не распознана. Попробуйте еще раз.");
        return;
      }
      if (event.error === "network") {
        setError("Сетевая ошибка во время распознавания речи.");
        return;
      }
      setError("Не удалось распознать речь. Попробуйте еще раз.");
    };

    recognition.onend = () => {
      isManualStopRef.current = false;
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [lang, onResult]);

  const start = useCallback(() => {
    if (isRecording) {
      return;
    }
    setError("");
    isManualStopRef.current = false;
    try {
      recognitionRef.current?.start();
    } catch (startError) {
      const startErrorMessage =
        typeof startError?.message === "string"
          ? startError.message.toLowerCase()
          : "";
      if (
        startErrorMessage.includes("already started") ||
        startErrorMessage.includes("already running")
      ) {
        return;
      }
      setError("Не удалось запустить распознавание. Попробуйте еще раз.");
    }
  }, [isRecording]);

  const stop = useCallback(() => {
    isManualStopRef.current = true;
    recognitionRef.current?.stop();
  }, []);

  return {
    isSupported,
    isRecording,
    error,
    start,
    stop,
  };
}
