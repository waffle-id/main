import { PencilRuler } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/shadcn/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "~/components/shadcn/drawer";
import { Input } from "~/components/shadcn/input";
import { Textarea } from "~/components/shadcn/textarea";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { Client } from "@gradio/client";
import { useEffect } from "react";
import { useWriteContract } from "wagmi";
import { ABI } from "~/constants/ABI";
import { CA } from "~/constants/CA";
import { publicClient } from "~/constants/wagmi";
import type { UserProfileData } from "../..";
import { addReview } from "~/routes/api/review/add-review";

type ReviewProps = {
  user: UserProfileData;
};

type Sentiment = "negative" | "neutral" | "positive";

type ReviewAIResponse = {
  quality: {
    level: "low" | "medium" | "high";
    feedback: string;
  };
  persona: {
    overall: string;
    score_distribution: Array<{
      persona: string;
      score: number;
    }>;
  };
  reputation_impact: {
    score: number;
    should_award_point: boolean;
    explanation: string;
  };
  web3_insights: {
    technical_depth: number;
    collaboration_signals: number;
    risk_signals: number;
    credibility_level: "low" | "medium" | "high";
  };
  summary: string;
  highlights: string[];
};

const sentimentScores: Record<Sentiment, number> = {
  negative: 1,
  neutral: 2,
  positive: 3,
};

export default function Review({ user }: ReviewProps) {
  let client: Client | null = null;
  const { writeContractAsync, isPending } = useWriteContract();
  const [isOpen, setIsOpen] = useState(false);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [qualityLevel, setQualityLevel] = useState<"low" | "medium" | "high" | null>(null);
  const [qualityLoading, setQualityLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");
  const [checking, setChecking] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [shouldAnalyze, setShouldAnalyze] = useState(false);

  const triggerAnalysis = () => {
    setShouldAnalyze((prev) => !prev);
  };

  const handleSubmit = async () => {
    console.log("Here submitting");
    if (!isFormValid) return;

    try {
      if (!publicClient) {
        console.error("❌ publicClient is not available");
        return;
      }
      const txHash = await writeContractAsync({
        abi: ABI,
        address: CA,
        functionName: "submitUsernameReview",
        args: [user.username, sentimentScores[sentiment!], description.trim()],
      });

      console.log(`TxHash: ${txHash}`);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      console.log("receipt", receipt);

      if (receipt.status !== "success") {
        console.warn("⚠️ Transaction reverted onchain");
        return;
      }

      await addReview({
        revieweeUsername: user.username,
        comment: description,
        txHash: txHash,
        // @ts-expect-error
        rating: sentiment,
        personas: [],
        overallPersona: "helpful",
      });

      setTitle("");
      setDescription("");
      setSentiment(null);
      setQualityLoading(false);
      setQualityLevel(null);
      setAiFeedback("");
      setIsOpen(false);
    } catch (err) {
      console.error("❌ Contract error:", err);
    }
  };

  useEffect(() => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (trimmedTitle.length === 0 || trimmedDesc.length === 0) {
      setQualityLevel(null);
      setAiFeedback("");
      setQualityLoading(false);
      setChecking(false);
      return;
    }

    setQualityLoading(true);
    setChecking(true);

    const timeout = setTimeout(async () => {
      try {
        if (!client) {
          client = await Client.connect("RVMV/review-analyzer");
        }

        const aiResponse = await client.predict("/predict", {
          title: trimmedTitle,
          description: trimmedDesc,
        });

        const results = aiResponse.data as ReviewAIResponse[];
        const result = results[0];

        console.log("AI Analysis Result:", result);
        setQualityLevel(result.quality.level);
        setAiFeedback(result.quality.feedback);
      } catch (err) {
        console.error("AI analysis failed", err);
        setQualityLevel(null);
        setAiFeedback("Unable to analyze review quality. Please try again.");
      } finally {
        setQualityLoading(false);
        setChecking(false);
      }
    }, 800);

    return () => {
      clearTimeout(timeout);
    };
  }, [title, description, shouldAnalyze]);

  useEffect(() => {
    setIsFormValid(
      sentiment !== null &&
        title.trim().length > 0 &&
        description.trim().length > 0 &&
        qualityLevel === "high" &&
        !checking &&
        !qualityLoading
    );
  }, [sentiment, title, description, qualityLevel, checking, qualityLoading]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <ButtonMagnet className="px-8 py-2" onClick={() => setIsOpen(true)}>
        <div className="flex flex-row items-center gap-2">
          <PencilRuler className="size-5" />
          Review
        </div>
      </ButtonMagnet>

      <DrawerContent className="pb-10 text-black h-full max-h-3/4">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-6">
          <DrawerHeader>
            <DrawerTitle className="text-center font-bold text-black text-2xl">
              Write review
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-row items-center gap-4 w-full">
            <ButtonMagnet
              color="red"
              className={`w-full ${sentiment === "negative" ? "bg-red-500 text-white" : ""}`}
              onClick={() => setSentiment("negative")}
            >
              Negative
            </ButtonMagnet>

            <ButtonMagnet
              className={`w-full ${sentiment === "neutral" ? "bg-yellow-500 text-white" : ""}`}
              onClick={() => setSentiment("neutral")}
            >
              Neutral
            </ButtonMagnet>

            <ButtonMagnet
              color="green"
              className={`w-full ${sentiment === "positive" ? "bg-green-500 text-white" : ""}`}
              onClick={() => setSentiment("positive")}
            >
              Positive
            </ButtonMagnet>
          </div>

          <div className="flex flex-col gap-2">
            <p>Title</p>
            <Input
              placeholder="Review title..."
              className="bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg h-max"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                triggerAnalysis();
              }}
              onBlur={triggerAnalysis}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Description</p>
            <div className="overflow-y-auto max-h-[10vh]">
              <Textarea
                placeholder="Write your detailed review. AI will analyze as you type or when you finish."
                className="resize-none dark:bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  triggerAnalysis();
                }}
                onBlur={triggerAnalysis}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 border border-black/20 rounded-lg bg-gray-50/50">
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                qualityLoading
                  ? "bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50"
                  : qualityLevel === "low"
                  ? "bg-red-500"
                  : qualityLevel === "medium"
                  ? "bg-yellow-400"
                  : qualityLevel === "high"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
            {qualityLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-black/70 animate-pulse font-medium">
                  AI analyzing your review...
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-black/80 capitalize font-medium">
                  Quality: {qualityLevel ?? "Not analyzed"}
                </span>
                {aiFeedback && (
                  <p className="text-xs text-black/60 animate-fade-in leading-relaxed">
                    💡 {aiFeedback}
                  </p>
                )}
                {qualityLevel === "low" && (
                  <p className="text-xs text-red-600 font-medium animate-fade-in">
                    ❌ Quality too low - Please add more detail and constructive feedback
                  </p>
                )}
                {qualityLevel === "medium" && (
                  <p className="text-xs text-orange-600 font-medium animate-fade-in">
                    ⚠️ Good quality but needs improvement - Add more specific details
                  </p>
                )}
                {qualityLevel === "high" && (
                  <p className="text-xs text-green-600 font-medium animate-fade-in">
                    ✅ Excellent quality - Ready to submit!
                  </p>
                )}
              </div>
            )}
          </div>

          <ButtonMagnet
            disabled={!isFormValid || isPending}
            className={`self-center w-max px-16 transition-all duration-300 ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              console.log("disabled", !isFormValid);
              if (isFormValid) {
                handleSubmit();
              }
            }}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Submitting...
              </div>
            ) : qualityLevel !== "high" && qualityLevel !== null ? (
              "Improve Quality to Submit"
            ) : (
              "Submit"
            )}
          </ButtonMagnet>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
