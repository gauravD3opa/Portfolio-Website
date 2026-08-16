import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { fetchConfig } from "../../lib/config";

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  title: string;
  subtitle: string;
}

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export function Contact() {
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    location: "",
    title: "",
    subtitle: "",
  });

  const [form, setForm] = useState<ContactForm>(initialForm);

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({
    type: "",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const cfg: any = await fetchConfig();

        if (!isMounted) return;

        const c = cfg?.contact ?? {};

        setContact({
          email: c.email ?? "",
          phone: c.phone ?? "",
          location: c.location ?? "",
          title: c.title ?? "",
          subtitle: c.subtitle ?? "",
        });
      } catch {
        // Keep default values.
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (
    field: keyof ContactForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
      });
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (sending) return;

    setStatus({
      type: "",
      message: "",
    });

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please fill in all fields.",
      });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });

      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to send your message."
        );
      }

      setForm(initialForm);

      setStatus({
        type: "success",
        message:
          "Thanks! Your message has been sent successfully.",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl">
            {contact.title || "Open to Work"}
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            {contact.subtitle ||
              "I'm looking for my next opportunity to build impactful software, solve challenging problems, and contribute to a strong engineering team."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary" />

                  <div>
                    <h4>Email</h4>

                    <p className="text-muted-foreground">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary" />

                  <div>
                    <h4>Phone</h4>

                    <p className="text-muted-foreground">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-primary" />

                  <div>
                    <h4>Location</h4>

                    <p className="text-muted-foreground">
                      {contact.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(event) =>
                      updateField(
                        "name",
                        event.target.value
                      )
                    }
                    maxLength={100}
                    disabled={sending}
                  />

                  <Input
                    placeholder="Your Email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    maxLength={254}
                    disabled={sending}
                  />
                </div>

                <Input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(event) =>
                    updateField(
                      "subject",
                      event.target.value
                    )
                  }
                  maxLength={200}
                  disabled={sending}
                />

                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  value={form.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value
                    )
                  }
                  maxLength={5000}
                  disabled={sending}
                />

                {/* Honeypot. Keep hidden from normal users. */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(event) =>
                    updateField(
                      "website",
                      event.target.value
                    )
                  }
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {status.message && (
                  <p
                    className={
                      status.type === "success"
                        ? "text-sm text-green-600"
                        : "text-sm text-destructive"
                    }
                    role="status"
                  >
                    {status.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={sending}
                >
                  <Send className="h-4 w-4" />

                  {sending
                    ? "Sending..."
                    : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}