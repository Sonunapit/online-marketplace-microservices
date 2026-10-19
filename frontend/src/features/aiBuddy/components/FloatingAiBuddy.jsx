import { useState } from "react";
import { Bot } from "lucide-react";
import AiBuddyPage from "../pages/AiBuddyPage";

export default function FloatingAiBuddy() {
const [open, setOpen] = useState(false);

return (
<>
{open && ( <div className="fixed inset-0 z-[9999] bg-white">
<AiBuddyPage
closeChat={() => setOpen(false)}
/> </div>
)}


  {!open && (
    <button
      onClick={() => setOpen(true)}
      className="
        fixed
        bottom-24
        md:bottom-6
        right-4
        md:right-6
        w-16
        h-16
        rounded-full
        bg-indigo-600
        text-white
        shadow-xl
        flex
        items-center
        justify-center
        animate-pulse
        z-[9999]
      "
    >
      <Bot size={30} />
    </button>
  )}
</>


);
}
