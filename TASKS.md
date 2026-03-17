# CubeA / HireAssist — Task List

> Generated after full analysis of https://cubea.nl/ and the codebase.
> Priority: P0 (critical/blocker) → P1 (high) → P2 (medium) → P3 (nice-to-have)

---

## Legend

| Column      | Meaning                                      |
|-------------|----------------------------------------------|
| Priority    | P0 = blocker, P1 = high, P2 = medium, P3 = low |
| Time        | Estimated dev time (one developer)           |
| Complexity  | Low / Medium / High                          |
| Status      | To Do / In Progress / Done                   |

---

## P0 — Critical / Blockers

| # | Task | Description | Time | Complexity | Status |
|---|------|-------------|------|------------|--------|
| 1 | **Create Privacy Policy page** | `/privacy` is linked in every footer but returns 404. Required for GDPR compliance (NL/EU). | 2-3h | Low | To Do |
| 2 | **Create Terms of Service page** | `/terms` linked in footer, returns 404. Legally required before accepting user data. | 2-3h | Low | To Do |
| 3 | **Create Impressum page** | `/impressum` linked in footer, returns 404. Legally required in the Netherlands. | 1h | Low | To Do |
| 4 | **Fix dead `/jobs` link** | CV Reviewer CTA links to `/jobs` which doesn't exist. Confuses users. Either build the page or redirect. | 1-2h | Low | To Do |
| 5 | **Enable TypeScript strict mode** | `strict: false` in tsconfig — hides real bugs. Enable and fix resulting type errors. | 2-4h | Medium | To Do |

---

## P1 — High Priority (Core Product Value)

| # | Task | Description | Time | Complexity | Status |
|---|------|-------------|------|------------|--------|
| 6 | **Upgrade AI Match to semantic embeddings** | Current tool is keyword/cosine-similarity only (labeled "demo"). Implement real embedding-based matching (e.g., OpenAI or Anthropic embeddings) for production-quality results. | 6-10h | High | To Do |
| 7 | **Build Job Board / Job Browser** | A `/jobs` page where job seekers can browse available positions. Core value prop for the job-seeker side. | 8-12h | High | To Do |
| 8 | **Build Cover Letter Generator tool** | Listed as "Coming Soon" on job seeker hub. AI-powered cover letter from CV + job description. | 4-6h | Medium | To Do |
| 9 | **Build JD Writer tool** | Listed as "Coming Soon" on recruiter hub. AI-generated job descriptions from brief inputs. | 4-6h | Medium | To Do |
| 10 | **Build Outreach Generator tool** | Listed as "Coming Soon" on recruiter hub. Generate personalized candidate outreach messages. | 4-6h | Medium | To Do |
| 11 | **Build Interview Questions tool** | Listed as "Coming Soon" on recruiter hub. Generate role-specific interview questions. | 3-5h | Medium | To Do |
| 12 | **Build Job Match Score tool** | Listed as "Coming Soon" on job seeker hub. Score how well a user fits a specific job. | 4-6h | Medium | To Do |
| 13 | **Add toast/notification system** | Replace browser `alert()` calls with proper toast notifications for form feedback. | 2-3h | Low | To Do |
| 14 | **Add input validation & security** | CV Reviewer has no max-length limit, AI Match has no validation, lead form lacks email validation. Add proper validation on all forms. | 3-4h | Medium | To Do |

---

## P2 — Medium Priority (Quality & Growth)

| # | Task | Description | Time | Complexity | Status |
|---|------|-------------|------|------------|--------|
| 15 | **Full i18n with proper library** | Current bilingual support is inline `tx` objects — fragile and doesn't cover tools/blog. Adopt `next-intl` or similar for proper NL/EN support across all pages. | 8-12h | High | To Do |
| 16 | **Add test suite** | Zero tests currently. Add Jest/Vitest + React Testing Library. Cover API routes, components, and key user flows. | 8-12h | High | To Do |
| 17 | **SEO optimization** | Add proper meta tags, Open Graph images, structured data (JSON-LD), and sitemap.xml for all pages. | 4-6h | Medium | To Do |
| 18 | **Fix blog navigation links** | Blog pages have header links to `/#how`, `/#features`, `/#contact` — these anchors don't work from the blog. Fix to use absolute paths or shared anchors. | 1-2h | Low | To Do |
| 19 | **Add more blog content** | Only 1 blog post exists ("Our Story"). Write 3-5 posts on recruiting, AI in hiring, Dutch tech market, etc. for SEO and credibility. | 6-10h | Low | To Do |
| 20 | **Consolidate RecruiterLanding.tsx** | `RecruiterLanding.tsx` exists but isn't routed — dead code. Either integrate it or remove it to reduce confusion. | 1h | Low | To Do |
| 21 | **Add loading states & skeletons** | Tools show basic "Analyzing..." text. Add proper skeleton loaders and progress indicators. | 3-4h | Low | To Do |
| 22 | **Rate limiting on API routes** | No rate limiting on `/api/cv-review` or `/api/match`. Could be abused. Add basic rate limiting. | 2-3h | Medium | To Do |
| 23 | **Error boundary components** | No React error boundaries. Add graceful error handling for tool pages. | 2-3h | Medium | To Do |
| 24 | **Analytics & event tracking** | Google Analytics is set up but no custom events. Track tool usage, form submissions, CTA clicks. | 3-4h | Low | To Do |
| 25 | **Mobile UX polish** | Responsive basics work but tools and forms could use mobile-specific improvements. | 4-6h | Medium | To Do |

---

## P3 — Nice to Have (Future)

| # | Task | Description | Time | Complexity | Status |
|---|------|-------------|------|------------|--------|
| 26 | **User accounts & auth** | Allow recruiters and job seekers to create accounts, save results, track history. | 16-24h | High | To Do |
| 27 | **Dashboard for recruiters** | Saved searches, candidate shortlists, pipeline management. | 16-24h | High | To Do |
| 28 | **PDF CV upload & parsing** | Currently text-only input. Add PDF upload with text extraction for CV tools. | 6-8h | High | To Do |
| 29 | **Email notifications** | Notify recruiters of new matches, job seekers of new jobs. | 6-8h | Medium | To Do |
| 30 | **Dark mode** | Add dark mode toggle. Tailwind makes this straightforward. | 3-4h | Low | To Do |
| 31 | **CI/CD pipeline** | GitHub Actions for lint, test, build on PR. Auto-deploy to Vercel. | 3-4h | Medium | To Do |
| 32 | **Accessibility audit (a11y)** | Full WCAG 2.1 AA compliance check and fixes. | 6-8h | Medium | To Do |
| 33 | **Performance optimization** | Lighthouse audit, image optimization, bundle splitting, caching headers. | 4-6h | Medium | To Do |

---

## Summary

| Priority | Count | Total Estimated Time |
|----------|-------|---------------------|
| P0 (Critical) | 5 | 8-13h |
| P1 (High) | 9 | 35-52h |
| P2 (Medium) | 11 | 42-63h |
| P3 (Nice to Have) | 8 | 60-86h |
| **Total** | **33** | **~145-214h** |

---

## Recommended Order of Execution

### Sprint 1 — Foundations (Week 1)
1. Legal pages (Privacy, Terms, Impressum) — P0 #1-3
2. Fix dead links — P0 #4
3. Enable TypeScript strict — P0 #5
4. Toast notification system — P1 #13
5. Input validation — P1 #14

### Sprint 2 — Core Tools (Week 2-3)
6. Cover Letter Generator — P1 #8
7. JD Writer — P1 #9
8. Interview Questions — P1 #11
9. Outreach Generator — P1 #10
10. Job Match Score — P1 #12

### Sprint 3 — Upgrade & Polish (Week 3-4)
11. Upgrade AI Match to embeddings — P1 #6
12. Build Job Board — P1 #7
13. SEO optimization — P2 #17
14. Fix blog nav — P2 #18

### Sprint 4 — Scale (Week 5+)
15. Full i18n — P2 #15
16. Test suite — P2 #16
17. Remaining P2 and P3 items
