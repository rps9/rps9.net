export const resumePdfPath = '/resume/ryan_smith_resume.pdf';

export const contactLinks = [
  { label: 'ryans6892@gmail.com', copyValue: 'ryans6892@gmail.com' },
  { label: '781-985-7151', copyValue: '781-985-7151' },
  { label: 'linkedin.com/in/rps9', href: 'https://linkedin.com/in/rps9' },
  { label: 'github.com/rps9', href: 'https://github.com/rps9' },
  { label: 'Boston, MA' },
];

export const experience = [
  {
    company: 'SUPERIOR PACKAGING AND FINISHING',
    location: 'Braintree, MA',
    role: 'Software Developer',
    date: 'May 2024 - Present',
    bullets: [
      'Created multiple online storefronts for clients now used to sell hundreds of unique products.',
      'Constructed middleware, internal REST APIs, and automation scripts to integrate client storefronts with internal workflows; supervised Azure Virtual Machines hosting these services.',
      'Developed a Python app using APIs to automate new storefront creation, reducing average setup time from one week to less than a day.',
    ],
  },
  {
    company: 'MASS GENERAL BRIGHAM',
    location: 'Somerville, MA',
    role: 'Integration Intern',
    date: 'May 2025 - Jul 2025',
    bullets: [
      'Collaborated with the Software Integration team, handling dozens of API-related requests a week and helping evaluate API selections for internal projects.',
      'Developed an automated API regression and baseline testing workflow in ReadyAPI and TestEngine, parameterizing test cases from SQL and validating responses; shipped a reusable XML suite.',
    ],
  },
  {
    company: 'BOSTON UNIVERSITY ENG IT',
    location: 'Boston, MA',
    role: 'IT Consultant (Systems and Linux)',
    date: 'Feb 2024 - Apr 2024',
    bullets: [
      'Imaged/configured Windows and Linux lab machines; resolved network + IAM issues (DNS/DHCP, 802.1X, VPN, MFA/SSO) and wrote guides that reduced repeat tickets.',
    ],
  },
];

export const projects = [
  {
    name: 'Federated Learning in ChRIS',
    date: 'Sep 2025 - Jan 2026',
    bullets: [
      'Built two Dockerized ChRIS plugins for federated learning in medical imaging: an orchestration plugin and a hospital-site execution plugin.',
      'Deployed on isolated multi-node setups via a bastion host and reverse SSH; validated end-to-end workflows on the New England Research Cluster while keeping data local.',
    ],
  },
  {
    name: 'Stock Tracking Website',
    date: 'Sep 2025 - Dec 2025',
    bullets: [
      'Constructed an event-driven microservice architecture by streaming trades from Finnhub WebSockets, publishing to AWS SQS, and consuming them in an analytics service to power real-time stock metrics.',
      'Shipped REST APIs with thread-safe in-memory storage, caching, and a metrics/observability endpoint.',
      'Operationalized stack with CI/CD and a testing suite using GitHub Actions, certifying end-to-end behavior.',
    ],
  },
  {
    name: 'Personal Website - Full-Stack Web App (React, FastAPI, PostgreSQL)',
    date: 'Oct 2023 - Present',
    bullets: [
      'Built a full-stack app with JWT auth, password hashing, a REST API for sign-up, email verification, and a normalized schema (users/roles/tokens) with constraints and indexes.',
    ],
  },
];
