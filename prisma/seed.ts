import { config } from "dotenv";
config({ path: ".env.local", override: true });
config({ path: ".env" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clear existing data in dependency order
  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.job.deleteMany();
  await prisma.client.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Seed user (recruiter — used for notifications)
  const password = await bcrypt.hash("password123", 10);
  const recruiter = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "alex.rivera@vero.com",
      password,
      role: "recruiter",
    },
  });

  // Seed clients
  const [techcorp, finserv, medhealth, retailmax] = await Promise.all([
    prisma.client.create({
      data: {
        name: "Jordan Wren",
        company: "TechCorp Solutions",
        email: "jordan.wren@techcorp.io",
        phone: "+1 415 555 0101",
        status: "active",
      },
    }),
    prisma.client.create({
      data: {
        name: "Fatima Osei",
        company: "FinServ Capital",
        email: "fatima.osei@finservcapital.com",
        phone: "+1 212 555 0188",
        status: "active",
      },
    }),
    prisma.client.create({
      data: {
        name: "Brian Nakamura",
        company: "MedHealth Systems",
        email: "brian.nakamura@medhealth.com",
        phone: "+1 312 555 0247",
        status: "active",
      },
    }),
    prisma.client.create({
      data: {
        name: "Claudia Ferreira",
        company: "RetailMax Group",
        email: "claudia.ferreira@retailmax.com",
        phone: "+1 713 555 0330",
        status: "inactive",
      },
    }),
  ]);

  // Seed jobs
  const [feJob, beJob, devopsJob, dsJob, pmJob, analystJob] = await Promise.all([
    prisma.job.create({
      data: {
        title: "Senior Frontend Engineer",
        description: "Lead the development of our customer-facing React applications. You will own the component library, mentor junior engineers, and collaborate closely with product design.",
        requirements: "5+ years React, TypeScript, CSS-in-JS, experience with design systems",
        salary: "$130,000 – $160,000",
        location: "San Francisco, CA (Hybrid)",
        type: "full-time",
        status: "open",
        clientId: techcorp.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Backend Engineer – Node.js",
        description: "Build and scale REST and GraphQL APIs powering our SaaS platform. Work closely with data and DevOps teams to ensure reliability at scale.",
        requirements: "4+ years Node.js, PostgreSQL, Redis, REST API design, Docker",
        salary: "$120,000 – $150,000",
        location: "Remote (US)",
        type: "full-time",
        status: "open",
        clientId: techcorp.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "DevOps / Platform Engineer",
        description: "Own our cloud infrastructure on AWS. Improve CI/CD pipelines, implement observability tooling, and ensure 99.9% uptime for critical healthcare services.",
        requirements: "Kubernetes, Terraform, AWS, GitHub Actions, strong Linux fundamentals",
        salary: "$125,000 – $155,000",
        location: "Chicago, IL (Hybrid)",
        type: "full-time",
        status: "open",
        clientId: medhealth.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Data Scientist",
        description: "Develop predictive models for credit risk and customer churn. Present findings to executive stakeholders and integrate models into production pipelines.",
        requirements: "Python, scikit-learn, SQL, statistical modelling, 3+ years experience",
        salary: "$115,000 – $140,000",
        location: "New York, NY (On-site)",
        type: "full-time",
        status: "open",
        clientId: finserv.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Product Manager – E-commerce",
        description: "Drive the roadmap for our core e-commerce platform. Coordinate engineering, design, and marketing to deliver features that increase conversion and AOV.",
        requirements: "3+ years product management, e-commerce experience, data-driven mindset",
        salary: "$105,000 – $130,000",
        location: "Houston, TX (Hybrid)",
        type: "full-time",
        status: "filled",
        clientId: retailmax.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Financial Analyst",
        description: "Support investment decisions through financial modelling, variance analysis, and market research. Produce monthly management reports for senior leadership.",
        requirements: "CFA Level I preferred, Excel/Power BI, 2+ years in financial services",
        salary: "$85,000 – $100,000",
        location: "New York, NY (On-site)",
        type: "full-time",
        status: "open",
        clientId: finserv.id,
      },
    }),
  ]);

  // Seed candidates
  const [alice, marcus, priya, david, sarah, james, maria, liam] = await Promise.all([
    prisma.candidate.create({
      data: {
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        phone: "+1 415 555 1001",
        skills: "React, TypeScript, Next.js, Figma, Storybook, CSS Modules",
        status: "active",
        experience: "6 years — previously Senior UI Engineer at Stripe",
        education: "B.S. Computer Science, UC Berkeley",
        notes: "Strong portfolio, available to start in 3 weeks.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "Marcus Thompson",
        email: "marcus.thompson@email.com",
        phone: "+1 512 555 1002",
        skills: "Node.js, PostgreSQL, Redis, Docker, GraphQL, AWS Lambda",
        status: "active",
        experience: "5 years — Backend Engineer at Shopify",
        education: "B.S. Software Engineering, UT Austin",
        notes: "Looking for remote-first role. Salary expectation $145k.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+1 206 555 1003",
        skills: "React, Node.js, TypeScript, MongoDB, AWS, Cypress",
        status: "active",
        experience: "4 years — Full Stack Engineer at Twilio",
        education: "M.S. Computer Science, University of Washington",
        notes: "Open to both frontend-heavy and full stack roles.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "David Okonkwo",
        email: "david.okonkwo@email.com",
        phone: "+1 312 555 1004",
        skills: "Kubernetes, Terraform, AWS, GCP, CI/CD, Prometheus, Grafana",
        status: "active",
        experience: "7 years — Platform Lead at Brex",
        education: "B.S. Systems Engineering, University of Illinois",
        notes: "Certified Kubernetes Administrator. Prefers hybrid or on-site.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "Sarah Kim",
        email: "sarah.kim@email.com",
        phone: "+1 646 555 1005",
        skills: "Python, scikit-learn, TensorFlow, SQL, Tableau, A/B testing",
        status: "active",
        experience: "4 years — Data Scientist at Capital One",
        education: "M.S. Statistics, Columbia University",
        notes: "Published paper on credit risk modelling. Strong communicator.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "James Patel",
        email: "james.patel@email.com",
        phone: "+1 212 555 1006",
        skills: "Financial modelling, Excel, Power BI, Bloomberg Terminal, SQL",
        status: "active",
        experience: "3 years — Analyst at Goldman Sachs",
        education: "B.Com Finance, NYU Stern",
        notes: "CFA Level II candidate. Looking to move to buy side.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "Maria Gonzalez",
        email: "maria.gonzalez@email.com",
        phone: "+1 713 555 1007",
        skills: "Product roadmap, Agile/Scrum, Mixpanel, SQL, Jira, user research",
        status: "active",
        experience: "5 years — PM at Walmart Labs then Amazon",
        education: "MBA, Rice University",
        notes: "Deep e-commerce background. Counter-offer risk — act fast.",
      },
    }),
    prisma.candidate.create({
      data: {
        name: "Liam O'Brien",
        email: "liam.obrien@email.com",
        phone: "+1 415 555 1008",
        skills: "React, Vue.js, JavaScript, Tailwind CSS, Jest, Accessibility (WCAG)",
        status: "active",
        experience: "3 years — Frontend Developer at Airbnb",
        education: "B.S. Computer Science, Stanford University",
        notes: "Strong WCAG expertise. Early career but exceptional output.",
      },
    }),
  ]);

  // Seed applications
  await Promise.all([
    prisma.application.create({
      data: { candidateId: alice.id, jobId: feJob.id, status: "interview", notes: "Passed technical screen. Loop scheduled for next Wednesday." },
    }),
    prisma.application.create({
      data: { candidateId: liam.id, jobId: feJob.id, status: "applied", notes: "Application received. Screening call to be booked." },
    }),
    prisma.application.create({
      data: { candidateId: priya.id, jobId: feJob.id, status: "applied", notes: "Strong portfolio — prioritise for review." },
    }),
    prisma.application.create({
      data: { candidateId: marcus.id, jobId: beJob.id, status: "offer", notes: "Verbal offer extended at $142k. Awaiting signed offer letter." },
    }),
    prisma.application.create({
      data: { candidateId: priya.id, jobId: beJob.id, status: "applied", notes: "Secondary application for backend role." },
    }),
    prisma.application.create({
      data: { candidateId: david.id, jobId: devopsJob.id, status: "interview", notes: "On-site scheduled. Panel includes CTO and lead SRE." },
    }),
    prisma.application.create({
      data: { candidateId: sarah.id, jobId: dsJob.id, status: "interview", notes: "Case study submitted. Feedback: exceptional modelling approach." },
    }),
    prisma.application.create({
      data: { candidateId: james.id, jobId: analystJob.id, status: "applied", notes: "Referred by Fatima Osei directly." },
    }),
    prisma.application.create({
      data: { candidateId: maria.id, jobId: pmJob.id, status: "hired", notes: "Offer accepted. Start date 2026-06-02." },
    }),
  ]);

  // Seed notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        title: "New application received",
        message: "Alice Johnson applied for Senior Frontend Engineer at TechCorp Solutions.",
        type: "info",
        read: false,
        userId: recruiter.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Interview loop confirmed",
        message: "David Okonkwo's on-site interview at MedHealth Systems is confirmed for Thursday 22 May.",
        type: "info",
        read: false,
        userId: recruiter.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Offer accepted",
        message: "Maria Gonzalez has accepted the Product Manager offer from RetailMax Group. Start date: 2 June 2026.",
        type: "success",
        read: true,
        userId: recruiter.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Offer pending — action required",
        message: "Marcus Thompson's verbal offer at TechCorp Solutions has not been signed. Follow up before end of week.",
        type: "warning",
        read: false,
        userId: recruiter.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: "New job posted",
        message: "FinServ Capital posted a new role: Data Scientist. 3 matching candidates are in your pipeline.",
        type: "info",
        read: true,
        userId: recruiter.id,
      },
    }),
  ]);

  console.log("✓ 1 user");
  console.log("✓ 4 clients");
  console.log("✓ 6 jobs");
  console.log("✓ 8 candidates");
  console.log("✓ 9 applications");
  console.log("✓ 5 notifications");
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
