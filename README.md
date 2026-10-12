# Krishnesh Karn — Portfolio

Next.js 14 (App Router) · Three.js · GSAP + ScrollTrigger · Lenis · Framer Motion · Tailwind CSS

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Edit your content
Everything comes from the resume and lives in **`lib/data.ts`** — name, links, projects, skills, experience.
Empty link strings (`linkedin`, `leetcode`, project `live` / `code`) are hidden automatically; fill them in.
Replace `public/Krishnesh_Karn_Resume.pdf` to update the download.

## Structure
```
app/
  layout.tsx            SmoothScroll > TransitionProvider > Navbar + page + Cursor
  template.tsx          wraps pages in <PageTransition/>
  page.tsx              Hero, Projects, About, Skills, Experience, Contact
  projects/[slug]/      case-study pages (use the page transition)
components/
  transition/           TransitionProvider (logic), TransitionOverlay (black curtain), PageTransition
  three/HeroScene.tsx   GLSL noise blob + particles, pointer parallax, scroll-linked
  sections/             one file per section
  Navbar.tsx            morphing floating-pill nav (threshold 50px) + mobile menu
  SmoothScroll.tsx      Lenis driven by GSAP ticker
lib/                    data, lenis store, useReveal hook
```

## Palette
ink `#08080B` · surface `#101015` · line `#23232C` · bone `#ECEBE4` · mute `#8A8A97`
acid `#C8F560` (accent) · iris `#7B61FF` (glow) · paper `#F1F0EA` (light section). Change in `tailwind.config.ts`.

## Page transition
`<TransitionLink>` → overlay slides `-100% → 0%` (cubic-bezier(0.76,0,0.24,1), 0.7s) → `router.push` → new page mounts
→ overlay slides `0% → 100%` → resets to `-100%`. Use `<TransitionLink href="/route">` for any internal link.
