import Herobanner from "@/components/homecomponents/herobanner";
import Slidesection from "@/components/slidesection";
import Tempimg from "../../public/assets/images/Tempimg.jpg";
import UIUXimg1 from "../../public/assets/images/UIUXimg1.jpg";
import UIUXimg2 from "../../public/assets/images/UIUXimg2.jpg";
import figmaimg1 from "../../public/assets/images/figmaimg1.jpg";
import figmaimg2 from "../../public/assets/images/figmaimg2.jpg";

export default function Home() {
  return (
    <>
      <Herobanner />
      <Slidesection
        intro={{
          eyebrow: "UI / UX Design",
          title: "Design that feels as good as it works.",
          description:
            "I design intuitive digital experiences that balance visual clarity, usability, and purpose. From understanding user needs to refining every interaction, I turn complex ideas into interfaces that feel natural to use.",
          image: UIUXimg1,
          imageAlt: "UI/UX design showcase",
        }}
        details={{
          image: UIUXimg2,
          imageAlt: "UI/UX design process showcase",
          items: [
            {
              heading: "Discover:",
              description:
                "Understanding users, goals, problems, and the purpose behind every product.",
            },
            {
              heading: "Structure:",
              description:
                "Creating information architecture, user flows, and wireframes that make experiences effortless.",
            },
            {
              heading: "Design:",
              description:
                "Building visual systems through typography, spacing, colour, hierarchy, and consistency.",
            },
            {
              heading: "Refine:",
              description:
                "Improving usability, accessibility, and interaction details across different screen sizes.",
            },
          ],
        }}
      />
      <Slidesection
        intro={{
          eyebrow: "Figma",
          title: "From the first frame to the final pixel.",
          description:
            "I use Figma to transform ideas into structured, high-fidelity designs. From wireframes and reusable components to interactive prototypes, I build design systems that make the journey from concept to development more consistent.",
          image: figmaimg1,
          imageAlt: "UI/UX design showcase",
        }}
        details={{
          image: figmaimg2,
          imageAlt: "UI/UX design process showcase",
          items: [
            {
              heading: "Wireframes:",
              description:
                "Map layouts and content hierarchy before polishing the visuals.",
            },
            {
              heading: "Visual Systems:",
              description:
                "Define typography, colour palettes, spacing, and reusable components.",
            },
            {
              heading: "Prototyping:",
              description:
                "Connect screens and interactions to communicate the intended experience.",
            },
            {
              heading: "Handoff:",
              description:
                "Organise components, assets, and specifications for a smoother development process.",
            },
          ],
        }}
      />
    </>
  );
}
