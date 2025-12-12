import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import CreateIntent from "./pages/CreateIntent";
import IntentOverview from "./pages/IntentOverview";
import IntentsList from "./pages/IntentsList";
import AlertsList from "./pages/AlertsList";
import AlertDetails from "./pages/AlertDetails";
import Connectors from "./pages/Connectors";
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
            <Route path="/intents" element={<IntentsList />} />
            <Route path="/intents/:id" element={<IntentOverview />} />
            <Route path="/alerts" element={<AlertsList />} />
            <Route path="/alerts/:id" element={<AlertDetails />} />
            <Route path="/connectors" element={<Connectors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
