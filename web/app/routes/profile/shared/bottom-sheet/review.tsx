import { PencilRuler } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/shadcn/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "~/components/shadcn/drawer";
import { Input } from "~/components/shadcn/input";
import { Textarea } from "~/components/shadcn/textarea";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

const RATE = ["neutral", "negative", "positive"] as const;
type RateType = (typeof RATE)[number];

export default function Review() {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    desc: string;
    rate: RateType;
  }>({
    title: "",
    desc: "",
    rate: "neutral",
  });

  function handlSubmit() {
    if (formData.title == "" && formData.desc == "") {
      toast.error("Fill all the field!");
    } else {
    }
  }

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
            <ButtonMagnet
              color="red"
              className="w-full"
              onClick={() =>
                setFormData((prev) => {
                  return { ...prev, rate: "negative" };
                })
              }
            >
              Negative
            </ButtonMagnet>
            <ButtonMagnet
              className="w-full"
              onClick={() =>
                setFormData((prev) => {
                  return { ...prev, rate: "negative" };
                })
              }
            >
              Neutral
            </ButtonMagnet>
            <ButtonMagnet
              className="w-full"
              color="green"
              onClick={() =>
                setFormData((prev) => {
                  return { ...prev, rate: "negative" };
                })
              }
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
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, title: formData.title };
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>Description</p>
            <Textarea
              placeholder="Description"
              className="resize-none dark:bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg h-max"
              value={formData.desc}
              onChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, title: formData.desc };
                })
              }
            />
          </div>

          <ButtonMagnet className="self-center w-max px-16" onClick={handlSubmit}>
            Submit
          </ButtonMagnet>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
