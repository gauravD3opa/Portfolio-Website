import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail, Download, ArrowDown, Sparkles, Code2, Terminal } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { fetchConfig } from "../../lib/config";

const defaultAvailability = { label: "", available: false };

const defaultHero = {
  headline: "",
  name: "",
  introLine: "",
  experienceText: "",
  experienceSuffix: "",
  description: "",
  image: "",
};

export function Hero() {
  const [availability, setAvailability] = useState(defaultAvailability);
  const [heroContent, setHeroContent] = useState(defaultHero as any);
  const [links, setLinks] = useState({ 
    resume: "", 
    github: "", 
    linkedin: "", 
    email: "", 
    leetcode: "", 
    hackerrank: "" 
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const cfg = await fetchConfig();
        if (!isMounted) return;

        setAvailability({ ...defaultAvailability, ...(cfg?.availability ?? {}) });
        setHeroContent({ ...defaultHero, ...(cfg?.hero ?? {}) });
        setLinks({
          resume: cfg?.links?.resume ?? "",
          github: cfg?.links?.github ?? "",
          linkedin: cfg?.links?.linkedin ?? "",
          email: cfg?.links?.email ?? "",
          leetcode: cfg?.links?.leetcode ?? "",
          hackerrank: cfg?.links?.hackerrank ?? "",
        });
      } catch (e) {
        if (isMounted) {
          setAvailability(defaultAvailability);
          setHeroContent(defaultHero as any);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="border-r border-foreground/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                <span className="block">{heroContent.headline}</span>
                <span className="block bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  {heroContent.name}
                </span>
              </h1>
              
              <div className="space-y-4">
                <p className="text-xl sm:text-2xl text-muted-foreground max-w-lg">
                  {heroContent.introLine}
                  <span className="text-primary"> {heroContent.experienceText}</span> {heroContent.experienceSuffix}
                </p>
                
                <p className="text-lg text-muted-foreground/80 max-w-md">
                  {heroContent.description}
                </p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {links.resume ? (
                <Button
                  size="lg"
                  className="group relative overflow-hidden px-8 py-6"
                  onClick={() => window.open(links.resume, "_blank", "noopener,noreferrer")}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Resume
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              ) : null}

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
                onClick={() => {
                  document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                View My Work
              </Button>
            </div>

            {/* Social & Coding Links */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {links.github ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  onClick={() => window.open(links.github, "_blank", "noopener,noreferrer")}
                  aria-label="Visit GitHub profile"
                >
                  <Github className="h-5 w-5" />
                </Button>
              ) : null}

              {links.linkedin ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  onClick={() => window.open(links.linkedin, "_blank", "noopener,noreferrer")}
                  aria-label="Visit LinkedIn profile"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              ) : null}

              {links.leetcode ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  onClick={() => window.open(links.leetcode, "_blank", "noopener,noreferrer")}
                  aria-label="Visit LeetCode profile"
                >
                  <Code2 className="h-5 w-5" />
                </Button>
              ) : null}

              {links.hackerrank ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  onClick={() => window.open(links.hackerrank, "_blank", "noopener,noreferrer")}
                  aria-label="Visit HackerRank profile"
                >
                  <Terminal className="h-5 w-5" />
                </Button>
              ) : null}

              {links.email ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                  onClick={() => (window.location.href = links.email)}
                  aria-label="Send email"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              ) : null}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1">AZ-204 & AI-200</div>
                <div className="text-sm text-muted-foreground">Microsoft Certified</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1">4+</div>
                <div className="text-sm text-muted-foreground">Years of Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-64 h-64 bg-gradient-to-tl from-accent/30 to-primary/10 rounded-full blur-3xl opacity-40"></div>
              
              <div className="relative z-10 group">
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border-4 border-background/50 shadow-2xl">
                  <ImageWithFallback
                    src={heroContent.image || undefined}
                    alt={heroContent.name || "Profile"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-sm border border-primary/20 rounded-2xl px-6 py-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full animate-pulse ${
                        availability.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm">{availability.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <ArrowDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}