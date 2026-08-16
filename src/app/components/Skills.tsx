import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Code, Settings, Globe, Database, TestTube, Cloud } from "lucide-react";
import { fetchConfig } from "../../lib/config";

const iconMap = {
  Backend: Code,
  Databases: Database,
  Cloud: Cloud,
  Frontend: Globe,
  AI: Settings,
  Other: TestTube,
};

const defaultSkills = { title: "", subtitle: "", categories: [] };

export function Skills() {
  const [skillsConfig, setSkillsConfig] = useState<any>(defaultSkills);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const cfg: any = await fetchConfig();
        if (!isMounted) return;
        setSkillsConfig({ ...defaultSkills, ...(cfg?.skills ?? {}) });
      } catch (e) {
        if (isMounted) setSkillsConfig(defaultSkills);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">{skillsConfig.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {skillsConfig.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsConfig.categories.map((category: any, index: number) => {
            const IconComponent =
              iconMap[
                category.title.includes("Backend")
                  ? "Backend"
                  : category.title.includes("Databases")
                    ? "Databases"
                    : category.title.includes("Cloud")
                      ? "Cloud"
                      : category.title.includes("Frontend")
                        ? "Frontend"
                        : category.title.includes("AI")
                          ? "AI"
                          : "Other"
              ] ?? Code;

            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill: any, skillIndex: number) => (
                      <Badge key={skillIndex} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}