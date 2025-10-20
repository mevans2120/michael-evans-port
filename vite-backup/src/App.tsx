import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/HomeMinimal";
import About from "./pages/About";
import AIShowcase from "./pages/AIShowcase";
import AIResearch from "./pages/AIResearch";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";
import Studio from "./pages/Studio";
import NavigationTest from "./pages/NavigationTest";
import DropdownTest from "./pages/DropdownTest";
import AIShowcaseDesignTest from "./pages/AIShowcaseDesignTest";
import PostPal from "./pages/ai-projects/PostPal";
import KarunaGatton from "./pages/ai-projects/KarunaGatton";
import AIResearchAgent from "./pages/ai-projects/AIResearchAgent";
import DepartmentOfArt from "./pages/ai-projects/DepartmentOfArt";

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
        <Route path="/about" element={<About />} />
        <Route path="/ai-showcase" element={<AIShowcase />} />
        <Route path="/ai-research" element={<AIResearch />} />
        <Route path="/case-studies/:slug" element={<CaseStudy />} />
        <Route path="/ai-projects/post-pal" element={<PostPal />} />
        <Route path="/ai-projects/karuna-gatton" element={<KarunaGatton />} />
        <Route path="/ai-projects/ai-research-agent" element={<AIResearchAgent />} />
        <Route path="/ai-projects/department-of-art" element={<DepartmentOfArt />} />
        <Route path="/studio/*" element={<Studio />} />
        <Route path="/nav-test" element={<NavigationTest />} />
        <Route path="/dropdown-test" element={<DropdownTest />} />
        <Route path="/ai-showcase-design-test" element={<AIShowcaseDesignTest />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
