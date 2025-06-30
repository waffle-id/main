import { PencilRuler } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "~/components/shadcn/drawer";
import { ButtonMagnet } from "~/components/waffle/button/magnet-button";

export default function Slash() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <ButtonMagnet className="px-8 py-2" onClick={() => setIsOpen(true)}>
        <div className="flex flex-row items-center gap-2">
          <PencilRuler className="size-5" />
          Slash
        </div>
      </ButtonMagnet>

      <DrawerContent className="pb-10 text-black">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center font-bold text-black">Slash Someone</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-10">
            <p>halo</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
