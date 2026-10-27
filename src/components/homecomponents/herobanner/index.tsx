"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./herobanner.module.scss";
import MouseWheel from "@/components/mousewheel";
import HeroBannerImage from "../../../../public/assets/images/krish-vaghasiya-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function Herobanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const mouseWheelRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        const image = imageRef.current;
        const heading = headingRef.current;
        const mouseWheel = mouseWheelRef.current;

        const imageSize = 320;
        const gap = 24;
        const finalImageLeft = "7%";

        gsap.set(image, {
          width: "100vw",
          height: "100vh",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          borderRadius: "0%",
        });

        gsap.set(heading, {
          left: `calc(50% + ${imageSize / 2 + gap}px)`,
          top: "50%",
          xPercent: 0,
          yPercent: -50,
        });

        gsap.set(mouseWheel, { opacity: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 7}`,
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          image,
          {
            width: imageSize,
            height: imageSize,
            borderRadius: "50%",
            duration: 1.5,
            ease: "power2.inOut",
          },
          0,
        );

        timeline.to(
          mouseWheel,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power1.out",
          },
          0,
        );

        timeline.to(
          image,
          {
            left: finalImageLeft,
            xPercent: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          1.5,
        );

        timeline.to(
          heading,
          {
            left: `calc(${finalImageLeft} + ${imageSize + gap}px)`,
            duration: 2,
            ease: "power2.inOut",
          },
          1.5,
        );

        const slideEnd = () => {
          const heading = headingRef.current;

          if (!heading) return 0;

          const headingWidth = heading.getBoundingClientRect().width;
          const headingLeft = heading.getBoundingClientRect().left;

          return headingLeft + headingWidth - window.innerWidth + 40;
        };

        timeline.to(
          [image, heading],
          {
            x: () => -Math.max(0, slideEnd()),
            duration: 5,
            ease: "none",
          },
          3.5,
        );

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      mm.add("(max-width: 768px)", () => {
        const image = imageRef.current;
        const heading = headingRef.current;
        const mouseWheel = mouseWheelRef.current;

        const imageSize = 180;
        const gap = 16;
        const finalImageLeft = "6%";

        gsap.set(image, {
          width: "100vw",
          height: "100vh",
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          borderRadius: "0%",
        });

        gsap.set(heading, {
          left: `calc(50% + ${imageSize / 2 + gap}px)`,
          top: "50%",
          xPercent: 0,
          yPercent: -50,
        });

        gsap.set(mouseWheel, { opacity: 1 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 6}`,
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(
          image,
          {
            width: imageSize,
            height: imageSize,
            borderRadius: "50%",
            duration: 1.5,
            ease: "power2.inOut",
          },
          0,
        );

        timeline.to(
          mouseWheel,
          {
            opacity: 0,
            duration: 0.3,
          },
          0,
        );

        timeline.to(
          image,
          {
            left: finalImageLeft,
            xPercent: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          1.5,
        );

        timeline.to(
          heading,
          {
            left: `calc(${finalImageLeft} + ${imageSize + gap}px)`,
            duration: 2,
            ease: "power2.inOut",
          },
          1.5,
        );

        const slideEnd = () => {
          const heading = headingRef.current;

          if (!heading) return 0;

          const headingWidth = heading.getBoundingClientRect().width;
          const headingLeft = heading.getBoundingClientRect().left;

          return headingLeft + headingWidth - window.innerWidth + 20;
        };

        timeline.to(
          [image, heading],
          {
            x: () => -Math.max(0, slideEnd()),
            duration: 4,
            ease: "none",
          },
          3.5,
        );

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.herobanner}>
      <div className={styles.herobannerimg}>
        <div ref={headingRef} className={styles.heading}>
          <h1>
            <span>Hello, I’m&nbsp;</span> <u>Krish Vaghasiya</u>.
          </h1>{" "}
          <p>
            A web designer and frontend developer based in Surat, Gujarat,
            crafting thoughtful interfaces, interactive experiences, and
            digital products.
          </p>
        </div>

        <Image
          ref={imageRef}
          src={HeroBannerImage}
          alt="Krish Vaghasiya"
          priority
          sizes="100vw"
          className={styles.portrait}
        />
      </div>

      <div ref={mouseWheelRef} className={styles.mouseWheel}>
        <MouseWheel />
      </div>
    </section>
  );
}
