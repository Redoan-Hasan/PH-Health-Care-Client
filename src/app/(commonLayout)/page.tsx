import { Hero } from "@/components/ui/modules/Home/Hero";
import Specialities from "@/components/ui/modules/Home/Specialities";
import Steps from "@/components/ui/modules/Home/Steps";
import Testimonials from "@/components/ui/modules/Home/Testimonials";
import TopRatedDoctors from "@/components/ui/modules/Home/TopRatedDoctors";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI-Powered Healthcare - Find Your Perfect Doctor</title>
        <meta
          name="description"
          content="Discover top-rated doctors tailored to your needs with our AI-powered healthcare platform. Get personalized recommendations and book appointments effortlessly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
        <Specialities />
        <TopRatedDoctors />
        <Steps />
        <Testimonials />
      </main>
    </>
  );
}
