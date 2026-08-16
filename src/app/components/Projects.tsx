import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { fetchConfig } from "../../lib/config";

export function Projects() {
  type Project = {
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    github?: string;
    demo?: string;
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const cfg: any = await fetchConfig();
        if (!isMounted) return;
        if (Array.isArray(cfg?.projects)) setProjects(cfg.projects);
        if (cfg?.projectsSection) {
          setSectionTitle(cfg.projectsSection.title ?? "");
          setSectionSubtitle(cfg.projectsSection.subtitle ?? "");
        }
      } catch (e) {
        // ignore
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="projects" className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">{sectionTitle || "Featured Projects"}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{sectionSubtitle || "A selection of projects that demonstrate my expertise in full-stack development and modern DevOps practices."}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    Code
                  </Button>
                  <Button size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}