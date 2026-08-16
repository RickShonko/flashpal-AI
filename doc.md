# FlashPal-AI — TVET Submission Document

## 1. Overview
FlashPal-AI is a flashcard-based learning application tailored for TVET (Technical and Vocational Education and Training). It helps learners build competency in practical skills by organizing content into decks of flashcards, tagging cards and decks with TVET competencies (learning outcomes), tracking study progress, and enabling teachers to assign materials and monitor competency mastery.

## 2. Problem Statement
Many TVET learners struggle to connect short study activities and formative assessments with the competencies required by industry and qualification standards. Teachers often have limited time to create concise learning materials tied directly to competency outcomes and to monitor student progress across those outcomes.

This project addresses these gaps by:
- Letting instructors and learners map flashcards and decks to competency statements (learning outcomes).
- Providing quick micro-learning activities (flashcards) aligned to competencies.
- Giving teachers assignment and reporting tools to track student progress per competency.

## 3. Solution Summary
FlashPal-AI provides:
- Competency-tagged decks and cards so learners can study with a focus on required outcomes.
- AI-assisted deck generation from notes to speed content creation.
- A teacher/admin interface to assign decks to students and view competency-level reports.
- Simple export (CSV) of competency reports for records or evidence submission.

## 4. How a Student Uses the App
1. Sign up and sign in.
2. Browse or receive assigned decks from a teacher.
3. Open a deck and study flashcards (flip to see answers, mark difficulty during review).
4. View progress: competency tags on cards and decks help the learner understand which learning outcomes are being practiced.
5. Export or share competency reports (if teacher provides access) as evidence of learning.

## 5. Features for Students
- Competency tags on decks/cards to show which learning outcomes are covered.
- AI generation of cards from notes for quick study material creation.
- Deck assignment from teachers with optional due dates.
- Progress & reporting: review counts and difficulty tracking feed into competency-level summaries.
- Access to curated resources (links, PDFs) via deck descriptions or teacher attachments (teacher feature).

## 6. Features for Teachers
- Create and tag competency-aligned decks.
- Assign decks to students and set due dates.
- Generate competency reports showing sessions, average difficulty, and assessed cards.
- Export CSV reports to include in student records.

## 7. Example Student Journey
1. A student enrolled in an electrical installation course is assigned a deck titled "Basic Electrical Tools & Safety".
2. Each card is tagged with competencies like "Identify hand tools" and "Apply basic safety checks".
3. The student studies daily; the system records review counts and difficulty.
4. The teacher runs a competency report showing which competencies the student has practiced and how often.
5. The student uses the CSV as part of their portfolio or to prepare for practical assessments.

## 8. Career Guidance & Resources
To help students connect learning to careers, the app can include (and teachers can populate) a resources section per deck:
- Short descriptions linking the competency to job roles (e.g., "Using hand tools" → "Apprentice electrician, maintenance technician").
- Links to tutorials, supplier manuals, YouTube how-tos, and relevant industry standards.
- Suggested next steps and recommended certifications.

## 9. Tech Notes (for assessors)
- Backend: Supabase (Postgres) with RLS. Migrations are stored in `supabase/migrations/`.
- Key DB additions for TVET features:
  - `flashcard_decks.competencies` (TEXT[])
  - `flashcards.competencies` (TEXT[])
  - `profiles.role` (TEXT: 'student' | 'teacher' | 'admin')
  - `assignments` table linking decks to students
- UI pages of interest:
  - `src/pages/CreateDeck.tsx` — deck creation with competencies
  - `src/pages/AddCard.tsx` — card creation with competencies
  - `src/pages/DeckView.tsx` — view deck and filter by competency
  - `src/pages/Reports.tsx` — competency report and CSV export
  - `src/pages/Admin.tsx` — teacher assignment UI

## 10. How to Run Locally
1. Install dependencies: `npm install`
2. Create a Supabase project and apply migrations (Dashboard SQL editor or `psql`).
3. Copy Supabase URL and anon key into `src/integrations/supabase/client.ts` (or use environment variables) and run:

```bash
npm run dev
```

## 11. How to Submit (TVET Event)
- Prepare a short demo highlighting:
  - Creating a competency-aligned deck
  - Assigning a deck to a student
  - Student studying and producing a competency report
- Include `doc.md` and a link to your deployed app (or a local demo video).

## 12. Suggested Next Improvements
- PDF certificate generation for demonstrated competencies.
- LMS export (SCORM/xAPI) for formal assessment systems.
- Offline sync and mobile-friendly study mode.

---

If you want, I can also:
- Add a short slide deck (PDF) summarising the app for the TVET judges.
- Generate sample decks with competency tags for a demo course.

