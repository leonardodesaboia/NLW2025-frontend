import { Routes,Route, BrowserRouter } from "react-router-dom";
import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";
import { QueryClient ,QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client= {queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:id" element={<Room />}/>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}
