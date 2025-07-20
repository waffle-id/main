import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CommandLineTypo } from "~/components/waffle/typography/command-line-typo";
import { Twitter, Search, Database, Sparkles, Zap } from "lucide-react";

interface ScrapingLoaderProps {
  username?: string;
  onComplete?: () => void;
}

export function ScrapingLoader({ username, onComplete }: ScrapingLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);

  const [currentMessage, setCurrentMessage] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const messages = [
    `🔍 First time scraping @${username || "your account"}? This might take a moment...`,
    "🆓 Using our custom scraper - completely free for you!",
    "📸 Extracting profile image and header content...",
    "📝 Gathering username, bio, and verification status...",
    "✨ Building your comprehensive profile data...",
    "🚀 Almost there! Finalizing your profile information...",
  ];

  const icons = [Twitter, Search, Database, Sparkles, Zap];

  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waves = [
        { amplitude: 30, frequency: 0.01, phase: 0, color: "rgba(252, 232, 187, 0.1)" },
        { amplitude: 25, frequency: 0.015, phase: Math.PI / 3, color: "rgba(244, 210, 151, 0.08)" },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            canvas.height / 2 + Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }

    return () => {
      gsap.killTweensOf([iconRef.current]);
    };
  }, []);

  useEffect(() => {
    gsap.to(
      { progress: 0 },
      {
        progress: 100,
        duration: 18,
        ease: "power2.out",
        onUpdate: function () {
          const currentProgress = this.targets()[0].progress;
          setProgress(currentProgress);
          if (progressFillRef.current) {
            gsap.set(progressFillRef.current, {
              width: `${currentProgress}%`,
            });
          }
        },
        onComplete: () => {
          setIsComplete(true);
          setTimeout(() => {
            if (containerRef.current) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                  onComplete?.();
                },
              });
            }
          }, 800);
        },
      }
    );

    const messageInterval = setInterval(() => {
      if (messageRef.current && !isComplete) {
        gsap.to(messageRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.4,
          onComplete: () => {
            if (!isComplete) {
              setCurrentMessage((prev) => (prev + 1) % messages.length);
              gsap.to(messageRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.3)",
              });
            }
          },
        });
      }
    }, 2000);

    const iconInterval = setInterval(() => {
      if (iconRef.current && !isComplete) {
        gsap.to(iconRef.current, {
          scale: 0.7,
          rotation: "+=90",
          duration: 0.5,
          ease: "back.in(1.5)",
          onComplete: () => {
            if (!isComplete) {
              setCurrentIcon((prev) => (prev + 1) % icons.length);
              gsap.to(iconRef.current, {
                scale: 1,
                duration: 0.7,
                ease: "back.out(1.3)",
              });
            }
          },
        });
      }
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(iconInterval);
    };
  }, [messages.length, icons.length, isComplete, onComplete]);

  useEffect(() => {
    if (isComplete && messageRef.current) {
      gsap.to(messageRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          setCurrentMessage(-1);
          gsap.to(messageRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          });
        },
      });
    }
  }, [isComplete]);

  const IconComponent = icons[currentIcon];

  const completionMessage = `✅ @${
    username || "Your account"
  } profile successfully scraped! Loading your data...`;
  const displayMessage = currentMessage === -1 ? completionMessage : messages[currentMessage];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center z-[200000] overflow-hidden px-4 bg-background"
    >
      <canvas
        ref={waveCanvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div
        className="flex flex-col items-center space-y-8 max-w-lg w-full mx-auto relative"
        style={{ zIndex: 3 }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute text-4xl opacity-20 text-muted-foreground animate-bounce">
            👤
          </div>

          <div
            ref={iconRef}
            className="relative z-10 rounded-full p-4 border-2 shadow-xl backdrop-blur-sm bg-card border-border"
          >
            <IconComponent className="w-8 h-8 text-foreground" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-foreground">
            Scraping Profile
          </h1>
          <CommandLineTypo className="text-sm flex items-center justify-center space-x-2 text-muted-foreground">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>First-time profile analysis in progress</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </CommandLineTypo>
        </div>

        <div className="w-full space-y-3">
          <div className="rounded-full h-3 overflow-hidden border shadow-inner bg-muted border-border">
            <div
              ref={progressFillRef}
              className="h-full rounded-full relative overflow-hidden transition-all duration-300 bg-foreground"
              style={{
                width: "0%",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Analyzing: {Math.round(progress)}%</span>
            <span className="animate-pulse">🔍 Processing...</span>
          </div>
        </div>

        <div className="rounded-2xl p-6 min-h-[100px] flex items-center justify-center shadow-lg w-full backdrop-blur-sm border bg-card border-border">
          <div ref={messageRef} className="text-center">
            <p className="text-base font-medium leading-relaxed text-card-foreground">
              {displayMessage}
            </p>
          </div>
        </div>

        <div className="rounded-xl p-5 w-full shadow-lg backdrop-blur-sm border bg-card border-border">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-semibold mb-3 flex items-center justify-center gap-2 text-card-foreground">
                👤 Profile Scraper Pipeline
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-muted-foreground">Profile Fetcher</span>
                </div>
                <span className="font-mono px-2 py-1 rounded-full text-green-700 bg-green-100">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse bg-amber-500"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <span className="text-muted-foreground">Bio Analyzer</span>
                </div>
                <span className="font-mono px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                  WORKING
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse bg-amber-500"
                    style={{ animationDelay: "0.6s" }}
                  />
                  <span className="text-muted-foreground">Image Processor</span>
                </div>
                <span className="font-mono px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                  BUILDING
                </span>
              </div>
            </div>

            <div className="text-center pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Custom scraper • Completely free • Open source technology 🎉
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 text-xs space-y-1 text-right text-muted-foreground">
        <p>⏱️ 15-20 seconds</p>
      </div>
    </div>
  );
}
