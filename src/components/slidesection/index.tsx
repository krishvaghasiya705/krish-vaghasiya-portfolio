"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./slidesection.module.scss";
import Image, { type ImageProps } from "next/image";

gsap.registerPlugin(ScrollTrigger);

export interface SlidesectionItem {
  heading: string;
  description: string;
}

export interface SlidesectionProps {
  backgroundGradient: string;
  intro: {
    eyebrow: string;
    title: string;
    description: string;
    image: ImageProps["src"];
    imageAlt: string;
  };
  details: {
    image: ImageProps["src"];
    imageAlt: string;
    items: SlidesectionItem[];
  };
}

export default function Slidesection({
  backgroundGradient,
  intro,
  details,
}: SlidesectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const imageHolderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const secondTextViewportRef = useRef<HTMLDivElement | null>(null);
  const secondTextContentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const firstImageHolder = imageHolderRefs.current[0];
    const secondImageHolder = imageHolderRefs.current[1];
    const secondTextViewport = secondTextViewportRef.current;
    const secondTextContent = secondTextContentRef.current;

    if (
      !section ||
      !track ||
      !firstImageHolder ||
      !secondImageHolder ||
      !secondTextViewport ||
      !secondTextContent
    ) {
      return;
    }

    let context: gsap.Context | undefined;
    let resizeFrame = 0;

    const createAnimation = () => {
      context?.revert();

      const textViewportStyles = window.getComputedStyle(secondTextViewport);
      const verticalPadding =
        Number.parseFloat(textViewportStyles.paddingTop) +
        Number.parseFloat(textViewportStyles.paddingBottom);
      const textContentViewportHeight = Math.max(
        0,
        secondTextViewport.clientHeight - verticalPadding,
      );
      const textScrollDistance = Math.max(
        0,
        secondTextContent.scrollHeight - textContentViewportHeight,
      );
      const textScrollDuration = textScrollDistance / window.innerHeight;
      const fillTextElements = Array.from(
        secondTextContent.querySelectorAll(`.${styles.fillText}`),
      );
      const viewportHeight = window.innerHeight;
      section.style.height = `${viewportHeight * 4 + textScrollDistance}px`;

      context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(firstImageHolder, {
            width: "100%",
            ease: "none",
            duration: 1,
          })
          .to(
            track,
            {
              xPercent: -50,
              ease: "none",
              duration: 1,
            },
            ">",
          )
          .to(
            secondImageHolder,
            {
              height: "100%",
              ease: "none",
              duration: 1,
            },
            ">",
          )
          .to(secondTextContent, {
            y: -textScrollDistance,
            ease: "none",
            duration: textScrollDuration,
          });

        if (fillTextElements.length > 0) {
          const fillTweenDuration = Math.min(
            0.3,
            textScrollDuration / fillTextElements.length,
          );

          timeline.to(
            fillTextElements,
            {
              backgroundPosition: "0% 0%",
              duration: fillTweenDuration,
              ease: "none",
              stagger: {
                amount: Math.max(0, textScrollDuration - fillTweenDuration),
              },
            },
            "<",
          );
        }
      }, section);

      ScrollTrigger.refresh();
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(createAnimation);
    };

    createAnimation();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(resizeFrame);
      context?.revert();
      section.style.height = "";
    };
  }, [details.items]);

  return (
    <div
      ref={sectionRef}
      className={styles.slidesectionmain}
      style={{ background: backgroundGradient }}
    >
      <div ref={trackRef} className={styles.slidesectiontrack}>
        <div className={styles.slidesectionfirstgrdmain}>
          <div className={styles.grditemsone}>
            <div className={styles.grdimgmain}>
              <div
                ref={(element) => {
                  imageHolderRefs.current[0] = element;
                }}
                className={styles.grdimgholder}
              >
                <Image
                  src={intro.image}
                  alt={intro.imageAlt}
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
          <div className={styles.grditemstwo}>
            <h2>{intro.eyebrow}</h2>
            <h3>{intro.title}</h3>
            <p>{intro.description}</p>
          </div>
        </div>
        <div className={styles.slidesectionsecondgrdmain}>
          <div className={styles.grditemsone}>
            <div className={styles.grdimgmain}>
              <div
                ref={(element) => {
                  imageHolderRefs.current[1] = element;
                }}
                className={styles.grdimgholder}
              >
                <Image
                  src={details.image}
                  alt={details.imageAlt}
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
          <div
            ref={secondTextViewportRef}
            className={styles.grditemstwo}
          >
            <div
              ref={secondTextContentRef}
              className={styles.grditemstwocontent}
            >
              {details.items.map((item, index) => (
                <div
                  key={`${item.heading}-${index}`}
                  className={styles.grditemstwoinner}
                >
                  <h2 className={styles.fillText}>{item.heading}</h2>
                  <h3 className={styles.fillText}>{item.description}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
