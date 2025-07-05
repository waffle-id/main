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
  const [aiFeedback, setAiFeedback] = useState("");
  const [checking, setChecking] = useState(false);

  const isFormValid =
    sentiment !== null &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    qualityLevel !== "low" &&
    qualityLevel !== null &&
    !checking;

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
        args: [
          user.username, // from props
          sentimentScores[sentiment!], // uint8
          description.trim(), // comment
        ],
      });

      console.log(`TxHash: ${txHash}`);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        console.warn("⚠️ Transaction reverted onchain");
        return;
      }

      await addReview({
        revieweeUsername: user.username,
        comment: description,
        txHash: txHash,
        rating: sentiment,
        personas: [], // Default value first, not used yet,
        overallPersona: "helpful",
      });

      // ✅ Only reset if successful
      setTitle("");
      setDescription("");
      setSentiment(null);
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

    // Don't even try to debounce if both are not filled
    if (trimmedTitle.length === 0 || trimmedDesc.length === 0) {
      setQualityLevel(null);
      setAiFeedback("");
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);
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

        console.log(result);
        setQualityLevel(result.quality.level);
        setAiFeedback(result.quality.feedback);
      } catch (err) {
        console.error("AI analysis failed", err);
        setQualityLevel(null);
        setAiFeedback("Could not analyze review.");
      } finally {
        setChecking(false);
      }
    }, 500); // Wait 500ms after last keystroke

    return () => clearTimeout(timeout); // Cleanup on each change
  }, [title, description]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <ButtonMagnet className="px-8 py-2" onClick={() => setIsOpen(true)}>
        <div className="flex flex-row items-center gap-2">
          <PencilRuler className="size-5" />
          Review
        </div>
      </ButtonMagnet>

      <DrawerContent className="pb-10 text-black">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-12">
          <DrawerHeader>
            <DrawerTitle className="text-center font-bold text-black text-2xl">
              Write review
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-row items-center gap-4 w-full">
            {/* <Button className="text-red-500 border-re" variant="outline">Negative</Button> */}
            <ButtonMagnet
              color="red"
              className={`w-full ${
                sentiment === "negative" ? "bg-red-500 text-white hover:text-white" : ""
              }`}
              onClick={() => setSentiment("negative")}
            >
              Negative
            </ButtonMagnet>

            <ButtonMagnet
              className={`w-full ${
                sentiment === "neutral" ? "bg-yellow-500 text-white hover:text-white" : "w-full"
              }`}
              onClick={() => setSentiment("neutral")}
            >
              Neutral
            </ButtonMagnet>

            <ButtonMagnet
              color="green"
              className={`w-full ${
                sentiment === "positive" ? "bg-green-500 text-white hover:text-white" : ""
              }`}
              onClick={() => setSentiment("positive")}
            >
              Positive
            </ButtonMagnet>
          </div>

          <div className="flex flex-col gap-2">
            <p>Title</p>
            <Input
              placeholder="Title"
              className="bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg h-max"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // value={form.from}
              // onChange={(e) =>
              //   setForm((prev) => {
              //     return { ...prev, from: e.target.value };
              //   })
              // }
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Description</p>
            <div className="overflow-y-auto max-h-[10vh]">
              <Textarea
                placeholder="Description"
                className="resize-none dark:bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // value={form.message}
                // onChange={(e) =>
                //   setForm((prev) => {
                //     return { ...prev, message: e.target.value };
                //   })
                // }
              />
            </div>
          </div>

          {qualityLevel && (
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  qualityLevel === "low"
                    ? "bg-red-500"
                    : qualityLevel === "medium"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
              />
              <span className="text-sm text-black/70 capitalize">{qualityLevel} quality</span>
            </div>
          )}

          <ButtonMagnet
            disabled={!isFormValid}
            className="self-center w-max px-16"
            onClick={handleSubmit}
          >
            Submit
          </ButtonMagnet>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
