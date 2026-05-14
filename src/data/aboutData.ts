import tsMediaLogo from '../assets/logo-ts-media-main.png';
import cakrawalaLogo from '../assets/logo-cakrawala-v2.webp';
import briLogo from '../assets/Logo BRI - Dianisa.com.png';
import type { TimelineItemProps } from '../components/TimelineItem';
import figmaIcon from '../assets/svg/figma.svg';
import notionIcon from '../assets/svg/notion.svg';
import vsCodeIcon from '../assets/svg/vscode.svg';
import githubIcon from '../assets/svg/github.svg';
import tailwindIcon from '../assets/svg/tailwind.svg';
import gitIcon from '../assets/svg/git.svg';

export const experienceData: TimelineItemProps[] = [
  {
    title: "Graphics Design Intern",
    subtitle: "TS Media • April 2024 - Present",
    description: "As a versatile Video Editor, Graphics Designer, Photographer, and Videographer, I have consistently delivered impactful visual content across multiple platforms. My role focused on helping social media division make content that drives engagement, strengthens brand identity, and tells compelling stories.",
    logo: tsMediaLogo,
    logoAlt: "TS Media Logo",
    isCurrent: true,
  },
  {
    title: "IT Support Intern",
    subtitle: "Bank Rakyat Indonesia • April - June 2020",
    description: "As an IT Support Intern at Bank Rakyat Indonesia, I actively contributed to ensuring system reliability by performing electrical and network cable installations, as well as conducting hardware maintenance. My role focused on maintaining stable and optimal system performance, supporting seamless operations across critical banking infrastructure.",
    logo: briLogo,
    logoAlt: "Bank BRI Logo",
  }
];

export const educationData: TimelineItemProps[] = [
  {
    title: "Bachelor of Computer Science",
    subtitle: "Cakrawala University • 2024 - Present",
    description: "Currently pursuing a degree in Computer Science. Building a strong foundation in software engineering principles, algorithms, and web technologies.",
    logo: cakrawalaLogo,
    logoAlt: "Cakrawala University Logo",
    isCurrent: true,
  }
];

export const tools = [
  { name: "Figma", icon: figmaIcon },
  { name: "Notion", icon: notionIcon },
  { name: "VS Code", icon: vsCodeIcon },
  { name: "Git & GitHub", icon: githubIcon },
  { name: "Tailwind CSS", icon: tailwindIcon },
  { name: "Git", icon: gitIcon }
];

export const interests: string[] = [
  "📷 Photography", "📹 Videography", "🚗 Automotive", 
  "⚽ Football", "🎮 Gaming", "🎵 Music", "🏸 Badminton", "and others"
];