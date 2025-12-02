// Hero.jsx
import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Button from "../components/Button";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  const scrollToEvents = () => {
    const el = document.getElementById("events");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg1.jpg" alt="Travel background" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1>Discover Amazing Places</h1>
              <h1>Explore the World with Us</h1>
              <h1>Your Adventure Starts Here</h1>
            </div>

            <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
              Plan your dream adventure with our curated events and experiences.
            </p>

            {/* Button updated to scroll to #events */}
            <Button
  text="Find Events"
  className="md:w-80 md:h-16 w-60 h-12"
  scrollToId="events" // ✅ Scrolls to the events section
/>
          </div>
        </header>
      </div>
    </section>
  );
};

export default Hero;
