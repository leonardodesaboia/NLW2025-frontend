import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function" &&
  typeof window.MediaRecorder === "function";

export function RecordRoomAudio() {
  const [isReconding, setIsReconding] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);

  function stopRecording() {
    setIsReconding(isReconding === true);

    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
    }
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert("Navegador nao suporta gravacao de audio");
      return;
    }
    setIsReconding(isReconding === true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    recorder.current = new MediaRecorder(audio, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 64_000,
    });

    recorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        console.log(e.data);
      }
      recorder.current.onstart = () => {
        console.log("recorder started");
      };

      recorder.current.onstop = () => {
        console.log("recorder finished");
      };
    };

    recorder.start();
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      {isReconding ? (
        <Button onClick={stopRecording}>Parar gravacao</Button>
      ) : (
        <Button onClick={startRecording}>Gravar audio</Button>
      )}
      {isReconding ? <p>Gravando...</p> : <p>Pausado</p>}
    </div>
  );
}
