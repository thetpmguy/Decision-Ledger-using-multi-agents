import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import CreateIntent from "./pages/CreateIntent";
import PlanReview from "./pages/PlanReview";
import Simulation from "./pages/Simulation";
import Timeline from "./pages/Timeline";
import Proof from "./pages/Proof";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateIntent />} />
            <Route path="/plans" element={<PlanReview />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/proof" element={<Proof />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
