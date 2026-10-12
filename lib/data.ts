/**
 * All portfolio content lives here, taken from the resume.
 * Edit this file to update the site — no need to touch components.
 *
 * Any link left as "" is automatically hidden in the UI.
 */

export const profile = {
  name: "Krishnesh Karn",
  firstName: "Krishnesh",
  lastName: "Karn",
  role: "Full-Stack Developer",
  tagline:
    "I build fast, secure and user-centric web apps — from the database to the pixel.",
  location: "Baddi, Himachal Pradesh, India",
  email: "karnkrishnesh970@gmail.com",
  resume: "/Krishnesh_Karn_Resume.pdf",
  // TODO: paste your real profile URLs. Empty strings hide the link.
  github: "https://github.com/krishnesh1",
  linkedin: "https://www.linkedin.com/in/krishneshkarn/?isSelfProfile=true",
  leetcode: "https://leetcode.com/u/nvTzO42OUR/",
  about:
    "Motivated full-stack developer with a solid foundation in computer science and hands-on experience architecting complete web applications. I care about responsive, user-centric platforms and about solving real-world problems through clean code — from requirement analysis all the way to testing and deployment.",
};

export const stats = [
  { value: "8.73", label: "CGPA · B.E. CSE" },
  { value: "5+", label: "Modules in one platform" },
  { value: "2", label: "Live full-stack apps" },
];

export const education = [
  {
    school: "Chitkara University",
    place: "Himachal Pradesh, India",
    degree: "B.E. in Computer Science Engineering",
    period: "Aug 2023 — Expected 2027",
    note: "CGPA 8.73 / 10",
  },
  {
    school: "Arniko Awasiya Secondary School",
    place: "Biratnagar, Nepal",
    degree: "High School",
    period: "2020 — 2022",
    note: "GPA 3.62 / 4",
  },
];

export const coursework = [
  "Data Structures",
  "Algorithms",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "Web Development",
  "Software Engineering",
  "Cloud Computing (Basics)",
];

export const skillGroups = [
  {
    title: "Languages",
    items: ["C / C++", "Java", "JavaScript", "SQL"],
  },
  {
    title: "Frontend",
    items: ["React.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT", "bcrypt", "AuthN / AuthZ"],
  },
  {
    title: "Databases",
    items: ["MongoDB", "MySQL"],
  },
  {
    title: "Tools & Cloud",
    items: ["Git", "GitHub", "Postman", "VS Code", "AWS", "Docker"],
  },
  {
    title: "Core Concepts",
    items: ["OOP", "Data Structures", "API Design", "Debugging", "Agile Basics"],
  },
];

export type Project = {
  slug: string;
  index: string;
  title: string;
  short: string;
  summary: string;
  highlights: string[];
  stack: string[];
  live: string;
  code: string;
};

export const projects: Project[] = [
  {
    slug: "society-management",
    index: "01",
    title: "Society Management App",
    short: "Full-stack platform for residents and admins.",
    summary:
      "A full-stack society management platform supporting 5+ major modules — visitor management, complaint tracking, billing and community polls — with role-based access for Admins and Residents.",
    highlights: [
      "JWT authentication, bcrypt password hashing and role-based authorization for Admin and Resident users, securing every protected API endpoint.",
      "RESTful APIs on MongoDB for complaint management, electricity billing, visitor tracking and announcements.",
      "Hardened backend with Express Rate Limiter, Helmet, CORS and input validation to block brute-force attacks.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT"],
    // TODO: add your live / repo links
    live: "",
    code: "",
  },
  {
    slug: "expense-tracker",
    index: "02",
    title: "Expense Tracker",
    short: "Shared expenses with real-time settle-up maths.",
    summary:
      "A multi-user expense tracker with real-time calculations and secure authentication that works out exactly who owes money to whom.",
    highlights: [
      "Supports multiple users with secure login and persistent database storage.",
      "Custom logic that accurately calculates who owes whom in real time.",
      "Secure API connections so every piece of data is saved safely.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    live: "",
    code: "",
  },
];

export const experience = [
  {
    company: "Hackathon",
    meta: "Team project · Under deadline",
    title: "Backend Developer",
    description:
      "Collaborated with a team to design and develop a complete software solution within the hackathon timeline. Contributed to backend development, feature implementation and integration while working under strict deadlines — strengthening debugging, collaboration and problem-solving by resolving technical challenges as they came up.",
    tags: ["Node.js", "Express.js", "REST APIs", "Teamwork", "Debugging"],
  },
  {
    company: "Self-directed",
    meta: "Full-stack builds · 2 live apps",
    title: "MERN Stack Developer",
    description:
      "Take features from requirement analysis through development, testing and deployment. Built and deployed MERN applications end to end — React front-ends, REST APIs, secured authentication and MongoDB data models — and keep sharpening the craft through Data Structures, Java and competitive programming.",
    tags: ["React.js", "MongoDB", "JWT", "Tailwind CSS", "Docker", "AWS"],
  },
];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
