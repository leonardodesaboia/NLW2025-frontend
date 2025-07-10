import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, Navigate } from "react-router-dom";

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function" &&
  typeof window.MediaRecorder === "function";

  type RoomParams = {
    roomId: string;
  };

export function RecordRoomAudio() {
  const [isReconding, setIsReconding] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);

  const params = useParams<RoomParams>();

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  function stopRecording() {
    setIsReconding(!isReconding);

    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
    }
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData();
    
    formData.append("file", audio, 'audio.webm');
    
    const response = await fetch (`http:localhost:3333/rooms/${params.roomId}/audio`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    console.log(result);
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert("Navegador nao suporta gravacao de audio");
      return;
    }
    setIsReconding(!isReconding);

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

    const currentRecorder = recorder.current;
    
    currentRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        uploadAudio(e.data);
      }
    };

    currentRecorder.onstart = () => {
      console.log("recorder started");
    };

    currentRecorder.onstop = () => {
      console.log("recorder finished");
    };

    // Start the recording after setting up event handlers
    currentRecorder.start();
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