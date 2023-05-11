import { SignInButton } from "@clerk/nextjs";
import { AppleLogo, ArrowRight } from "@phosphor-icons/react";
import Image from "next/image";

export default function InitialExploreModal() {
  return (
    <div className="absolute animate-fadeIn inset-0 bg-dark-400/75 w-full h-full z-50 grid place-items-center">
      <div className="animate-moveIn w-3/4 md:w-1/2 lg:w-1/3 h-3/4 md:h-1/2 bg-dark-500 rounded-3xl flex flex-col overflow-hidden">
        <div className="h-1/4 grid place-items-center relative flex-1">
          <Image
            src="/init-modal-bg.png"
            alt="modal-bg"
            fill
            className="object-cover z-10"
          />
          <div className="absolute inset-0 bg-dark-500/50 z-10" />
          <h2 className="font-bold text-xl z-20">Explore Gymlink</h2>
        </div>
        <div className="p-6 flex text-light-400 flex-col gap-2 flex-[2]">
          <p className="font-medium">
            Explore our app features and data, and see how Gymlink can help you
            find like-minded gym goers nearby.
          </p>
          <p>
            Sign up and join the community to start posting and asking your own
            questions. Dowload the app to get the fullest experience.
          </p>
        </div>

        <div className="flex-[0.5] px-6 flex flex-col md:flex-row mb-4 md:mb-0 w-full justify-end gap-2">
          <a
            href="https://testflight.apple.com/join/NTM6DRrW"
            className="border-[0.5px] border-light-500 text-light-500 rounded-lg px-4 py-2 w-full md:w-fit h-fit flex items-center hover:bg-light-500 hover:text-dark-500 transition-all"
          >
            <AppleLogo size={16} weight="fill" />
            <span className="ml-2 font-medium">Download</span>
          </a>
          <div className="px-4 py-2 bg-light-500 text-dark-500 w-full md:w-fit h-fit rounded-lg border-[0.5px] border-light-500 flex gap-2 items-center">
            <ArrowRight size={16} weight="bold" />
          <SignInButton mode="modal">Get Started</SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
}
