import { Routes,Route, BrowserRouter } from "react-router-dom";
import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";
import { QueryClient ,QueryClientProvider } from "@tanstack/react-query"
import { RecordRoomAudio } from "./pages/record-room-audio";

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateRoom />} />
          <Route path="/rooms/:roomId" element={<Room />} />
          <Route path="/rooms/:roomId/audio" element={<RecordRoomAudio />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
