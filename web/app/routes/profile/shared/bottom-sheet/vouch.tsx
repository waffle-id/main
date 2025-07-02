import { PencilRuler } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "~/components/shadcn/drawer";
import { Input } from "~/components/shadcn/input";
import { Textarea } from "~/components/shadcn/textarea";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";
import { InputAmount } from "~/components/waffle/form/input-amount";

export default function Vouch() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <ButtonMagnet className="px-8 py-2" onClick={() => setIsOpen(true)}>
        <div className="flex flex-row items-center gap-2">
          <PencilRuler className="size-5" />
          Vouch
        </div>
      </ButtonMagnet>

      <DrawerContent className="pb-10 text-black">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-12">
          <DrawerHeader>
            <DrawerTitle className="text-center font-bold text-black">Vouch this user</DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-2">
            <p>Vouch</p>
            <InputAmount
              placeholder="0"
              // value={form.amount}
              // onChange={(e) =>
              //   setForm((prev) => {
              //     return { ...prev, amount: Number(e.target.value) };
              //   })
              // }
            />
          </div>

          <div className="flex flex-col gap-2">
            <p>Title</p>
            <Input
              placeholder="Title"
              className="bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg h-max"
              type="text"
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
            <Textarea
              placeholder="Description"
              className="resize-none dark:bg-transparent focus-visible:ring-0 placeholder:text-black/50 border-black/50 focus-visible:border-black md:text-lg h-max"
              // value={form.message}
              // onChange={(e) =>
              //   setForm((prev) => {
              //     return { ...prev, message: e.target.value };
              //   })
              // }
            />
          </div>

          <ButtonMagnet className="self-center w-max px-16">Submit</ButtonMagnet>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
