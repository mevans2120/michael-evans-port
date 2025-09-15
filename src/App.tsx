import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Capabilities from "./pages/Capabilities";
import About from "./pages/About";
import AIShowcase from "./pages/AIShowcase";
import AIResearch from "./pages/AIResearch";
import CasaBonita from "./pages/CasaBonita";
import BeforeLauncher from "./pages/BeforeLauncher";
import VirginAmerica from "./pages/VirginAmerica";
import Peddle from "./pages/Peddle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-showcase" element={<AIShowcase />} />
        <Route path="/ai-research" element={<AIResearch />} />
        <Route path="/case-studies/casa-bonita" element={<CasaBonita />} />
        <Route path="/case-studies/before-launcher" element={<BeforeLauncher />} />
        <Route path="/case-studies/virgin-america" element={<VirginAmerica />} />
        <Route path="/case-studies/peddle" element={<Peddle />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
