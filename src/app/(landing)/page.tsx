import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import TechSecurity from "@/components/landing/TechSecurity";
import FinalCTA from "@/components/landing/FinalCTA";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <Features />
            <HowItWorks />
            <TechSecurity />
            <FinalCTA />
        </>
    );
}