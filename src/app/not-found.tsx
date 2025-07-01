import { Button } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import images from "../../public/assets/images/images";

export default function NotFoundPage() {
  return (
    <>
      <div>
        <div className="flex h-[100vh] items-center justify-center">
          <div className="flex flex-col items-center gap-5 text-center text-blue-800 dark:text-white">
            <div className="flex flex-col items-center gap-2 md:flex-row lg:flex-row">
              <Image
                src={images.mr_tankee_magnifying_glass}
                alt={"Mr. Tankee with Magnifying Glass"}
                width={200}
                height={200}
                priority
              />
              <div className="flex flex-col items-center gap-2">
                <p className="text-9xl font-extrabold">404</p>
                <h1 className="text-2xl font-bold">Page Not Found</h1>
              </div>
            </div>
            <p className="text-xl font-semibold">It looks like we don&apos;t have water connection here yet.</p>
            <Link href={"/dashboard"}>
              <Button className="mt-4">
                <HomeIcon />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
