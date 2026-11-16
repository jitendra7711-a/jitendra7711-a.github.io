# Jitendra Patel — DevOps & SRE

An original infrastructure-atlas portfolio built with TypeScript, Vite, and Tailwind CSS. Midnight blue, glacier, and acid yellow; bold condensed typography; a custom animated isometric server landscape; scroll parallax; opposing technology marquees; and alternating repository studies.

## Run locally

Use **Node.js 24 LTS** and npm 11 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

The build runs TypeScript checks and emits a static website in `dist/`.

## Public content

Edit `src/profile.ts` for your name, GitHub URL, LinkedIn URL, technology list, and featured repositories. The biography and page metadata are in `index.html`. Set `profile.email` to add a real `mailto:` contact link and email-copy button. Until an email is provided, contact links go to LinkedIn.

Featured project descriptions were checked against the public source in these repositories on 16 November 2026:

- [terraform-for-devops](https://github.com/jitendra7711-a/terraform-for-devops): EC2, key pairs, security groups, and EBS in `ec2.tf`.
- [Github_actions_AKS](https://github.com/jitendra7711-a/Github_actions_AKS): Maven → Docker → Amazon ECR → Azure AKS.
- [github_actions_eks](https://github.com/jitendra7711-a/github_actions_eks): Maven → Docker → Amazon ECR → EKS rollout restart.

These are descriptions of repository code. They do not claim production results, uptime, or measured business impact. Illustrations are original architecture studies, not product screenshots.

## Deployment on Render

The portfolio source lives in the dedicated `jitendra7711-a/jitendra7711-a.github.io` repository.

Render configuration:

- Service type: Static Site
- Branch: `main`
- Node.js: `24.22.1`, pinned in `.node-version`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

The build includes TypeScript validation. Assets and fonts are self-hosted, and the site does not require secrets, a database, or runtime API calls. The relative Vite asset base also supports other static hosts.

## Motion and accessibility

- Honors `prefers-reduced-motion` and updates when the preference changes.
- A visible pause control stops the marquee, canvas, SVG animation, and decorative loops.
- The canvas renders at 25fps only while visible, unpaused, and in an active tab.
- Semantic sections, skip link, keyboard focus indicators, mobile navigation with Escape support, and descriptive external links.
- Smooth anchor navigation uses the browser's native scrolling; there is no scroll hijacking.

## Design assets

Barlow Condensed, Manrope, and IBM Plex Mono are bundled locally through their Fontsource packages, under their included open-source font licenses. Icons are from Lucide (ISC license). All diagram and canvas artwork is implemented in this source.
