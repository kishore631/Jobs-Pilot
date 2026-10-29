# Jobs Pilot website upgrade

This is a plain HTML/CSS/JavaScript website bundle designed to fit the existing Jobs Pilot project.

## Files

- `index.html` — responsive homepage
- `jobs.html` — searchable/filterable job listing page
- `job.html?id=your-job-id` — job detail template
- `about.html` — About Us
- `privacy-policy.html` — Privacy Policy starter
- `terms.html` — Terms and Conditions starter
- `disclaimer.html` — job and external-link disclaimer
- `career-guides.html` — career guidance page
- `contact.html` — contact details
- `style.css`, `pages.css` — responsive styles
- `script.js` — mobile navigation, filtering and job detail rendering
- `jobs.js` — manually maintained listings
- `robots.txt`, `sitemap.xml` — basic crawl files

## Install into the existing repository

1. Download and extract this bundle.
2. Back up the current project or commit it to Git first.
3. Copy the new HTML/CSS/JS and crawl files into the existing `jobs-pilot-website` directory (the Vercel root directory in the existing setup).
4. Keep the existing `logo.jpeg` in the same directory as `index.html`. The bundle does not include or replace your logo.
5. Open the site locally using a simple local HTTP server or preview it with your editor. Check every navigation link and mobile layout.
6. Commit and push to GitHub. Vercel should deploy from the existing configured root directory.
7. Test the live site, then update Search Console and submit `https://jobs-pilot.vercel.app/sitemap.xml`.

## Add a job manually

Open `jobs.js` and add an object to `window.JOBS_PILOT_JOBS`. Use a unique lowercase `id` (for example `software-engineer-companyname-2026`), replace all sample values with verified details, and set `published: true` only when the role is confirmed open and the official application link is valid.

The job list intentionally starts empty. This avoids presenting sample or invented vacancies as real jobs. Do not publish expired roles. Remove or unpublish a listing when the employer closes it. Use accurate salary and deadline information; use `Not disclosed` or omit a detail when it is not known.

Example object shape (do not publish this example as a real vacancy):

```js
{
  id: "replace-with-unique-slug",
  published: false,
  title: "Exact title from the official listing",
  company: "Employer name",
  location: "City, State, India",
  category: "Technology",
  employmentType: "Full-time",
  experience: "As stated by employer",
  salary: "Not disclosed",
  datePosted: "2026-10-29",
  deadline: "",
  sourceUrl: "https://official-employer-website.example/careers/job",
  summary: "Accurate short summary",
  eligibility: ["Verified requirement"],
  responsibilities: ["Verified responsibility"],
  skills: ["Verified skill"],
  description: "Useful, accurate role summary",
  officialSourceName: "Employer careers page"
}
```

## Important SEO note for job rich results

This bundle uses a query-string detail template for manually maintained listings. Google recommends `JobPosting` structured data on a unique page for a single job, where the markup matches the complete, visible job description. Do not add `JobPosting` markup to the homepage or the job listing/search page. Before pursuing job rich results, create stable, individually crawlable job URLs with complete visible details and accurate expiry handling, then validate each page with Google's Rich Results Test. Do not mark up unverified or expired jobs.

## Privacy and AdSense

The legal pages are starting templates, not legal advice. Review them against the site's actual practices before launch. The privacy policy must accurately reflect whether analytics, cookies, advertising, contact forms or other third-party services are active. If you enable AdSense, review current Google publisher policies and applicable consent requirements, and update the privacy notice accordingly.

Do not click your own ads, ask users to click ads, disguise ads as job cards or navigation, or place ads where accidental clicks are likely. AdSense approval is not guaranteed by having policy pages alone; content quality, site functionality and all applicable policies matter.

## Contact

The contact page currently uses `gidigikishore@gmail.com`. Change it if you want a different public contact address.
