// import Image from "next/image";
import { Toaster } from "@/components/ui/sonner"

import AddNote from "@/components/AddNote";
import Background from "@/components/Grounds/Background";
import Foreground from "@/components/Grounds/Foreground";
import NotesList from "@/components/NoteList";
// import { ClerkProvider } from "@clerk/nextjs";

export default function Home() {
  
  return (
    <>
      {/* <ClerkProvider> */}
      <Toaster />

      

      <div className='relative w-full h-screen bg-zinc-100'>
        <Background />
        <Foreground />



      </div>
      {/* </ClerkProvider> */}

    </>
  );
}
