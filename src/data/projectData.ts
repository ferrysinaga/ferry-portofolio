import type { ProjectItemProps } from '../components/ProjectAccordion';
// Impor keempat gambar Mie Gacoan
import gacoan1 from '../assets/project1-migacoan/1.png';
import gacoan2 from '../assets/project1-migacoan/2.png';
import gacoan3 from '../assets/project1-migacoan/3.png';
import gacoan4 from '../assets/project1-migacoan/4.png';

export const projectData: ProjectItemProps[] = [
  {
    title: "Mie Gacoan Mobile App Design",
    description: "This design was created based on the problem we identified, where Mie Gacoan did not yet have an application that allowed direct ordering via mobile devices and still relied on cashier transactions.",
    imageUrl: [gacoan1, gacoan2, gacoan3, gacoan4],
    roles: ["UI/UX Design"],
    tools: ["Figma"],
    year: "2024",
    figmaUrl: "https://www.figma.com/proto/jAKv1JRctjyJ8Jv5AcmIAh/IMK_kel.Resbi?node-id=1738-1394&viewport=152%2C560%2C0.18&t=vWnNGj9QZk8hDdg5-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1738%3A784&show-proto-sidebar=1&page-id=1738%3A768", // Ganti dengan link figma Anda yang asli
    githubUrl: "https://migacoan-demo.com" // Contoh link live demo
  },
  {
    title: "EduChamp App Design",
    description: "This design was created by combining Duolingo and Quizziz, and within the website we developed, there is a gamification-based learning feature.",
    imageUrl: "https://placehold.co/256x256/1d1d1d/white?text=EduChamp",
    roles: ["UI/UX Design"],
    tools: ["Figma", "Visual Code Studio", "Notion"],
    year: "2024",
    figmaUrl: "https://www.figma.com/", // Ganti dengan link figma Anda yang asli
    githubUrl: "https://educhamp-demo.com" // Contoh link live demo
  },
  {
    title: "SemaraLab Company Profile",
    description: "Web company profile for the digital and creative marketing agency, “Semara Lab”. This project has a public section (frontend) to display services and portfolios, as well as an admin panel (backend) for content management.",
    imageUrl: "https://placehold.co/256x256/1d1d1d/white?text=SemaraLab",
    roles: ["Full-Stack", "UI/UX Design"],
    tools: ["PHP", "HTML", "CSS", "Javascript"],
    year: "2024",
    figmaUrl: "https://www.figma.com/", // Ganti dengan link Figma Anda
    githubUrl: "https://github.com/", // Ganti dengan link repository Github Anda
  },
  {
    title: "KATH Event Organizer Company Profile & Event Dashboard(On Going)",
    description: "Kath Event Organizer is a company profile website created with the purpose of serving as a registration platform for a business idea competition. This platform combines the company's professional identity with a practical digital registration system.",
    imageUrl: "https://placehold.co/256x256/1d1d1d/white?text=KATH+Event",
    roles: ["UI/UX Design", "Front-End"],
    tools: ["React", "Tailwind CSS", "Next.Js", "Git", "Github", "Figma"],
    year: "2024",
    figmaUrl: "https://www.figma.com/", // Ganti dengan link Figma Anda
    githubUrl: "https://github.com/" // Ganti dengan link repository Github Anda
  }
];