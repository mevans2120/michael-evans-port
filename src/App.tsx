import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/HomeMinimal";
import Capabilities from "./pages/Capabilities";
import About from "./pages/About";
import AIShowcase from "./pages/AIShowcase";
import AIResearch from "./pages/AIResearch";
import CasaBonita from "./pages/CasaBonita";
import BeforeLauncher from "./pages/BeforeLauncher";
import VirginAmerica from "./pages/VirginAmerica";
import Peddle from "./pages/Peddle";
import NotFound from "./pages/NotFound";
import Studio from "./pages/Studio";
import NavigationTest from "./pages/NavigationTest";
import DropdownTest from "./pages/DropdownTest";
import HomeDesignPreview from "./pages/HomeDesignPreview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      {/* Skip navigation link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
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
        <Route path="/studio/*" element={<Studio />} />
        <Route path="/nav-test" element={<NavigationTest />} />
        <Route path="/dropdown-test" element={<DropdownTest />} />
        <Route path="/design-preview" element={<HomeDesignPreview />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
