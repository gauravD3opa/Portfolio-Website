import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchConfig } from "../../lib/config";

export function Experience() {
  type ExperienceItem = {
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    technologies: string[];
  };

  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);

  // Load experiences and section text from public/portfolio-config.json
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const cfg: any = await fetchConfig();
        if (!isMounted) return;
        if (Array.isArray(cfg?.experiences)) setExperiences(cfg.experiences);
        if (cfg?.experience) {
          setSectionTitle(cfg.experience.title ?? "");
          setSectionSubtitle(cfg.experience.subtitle ?? "");
        }
      } catch (e) {
        // ignore
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Experiences are read-only in the UI; configurable via `public/portfolio-config.json`
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSubtitle, setSectionSubtitle] = useState("");

  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-3xl md:text-4xl">{sectionTitle}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{sectionSubtitle}</p>
        </div>

        {/* experiences are displayed read-only */}

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {exp.title}
                    </CardTitle>
                    <p className="text-primary mt-1">{exp.company}</p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {exp.period}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {exp.location}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}