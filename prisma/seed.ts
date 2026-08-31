import { PrismaClient, ProjectStatus, Visibility } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed with real portfolio data...");

  // 1. Clean existing database
  console.log("Cleaning database...");
  await prisma.journalEntryProject.deleteMany({});
  await prisma.journalEntrySkill.deleteMany({});
  await prisma.projectSkill.deleteMany({});
  await prisma.projectTopic.deleteMany({});
  await prisma.projectRelation.deleteMany({});
  await prisma.articleTopic.deleteMany({});
  await prisma.articleTag.deleteMany({});

  await prisma.journalEntry.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "dhanush.mendu@example.com" },
    update: {},
    create: {
      email: "dhanush.mendu@example.com",
      password: hashedPassword,
      name: "Dhanush Mendu",
    },
  });
  console.log(`Created user: ${user.email}`);

  // 3. Create site profile
  await prisma.profile.create({
    data: {
      name: "Dhanush Mendu",
      tagline: "Research Intern at Centre for Social and Policy Research",
      bio: "Research Intern at Centre for Social and Policy Research (CSPR), State Scan – Telangana Team. Focused on public finances, statistics, and reporting for public good. I produce state scan reports covering monthly spotlights, policy impulses, data insights, and district focuses. Seeking rigorous quality research that provides new perspectives to government and fosters positive policy dialogue.\n\nSupervisor: Subramanian S (PhD), Director Centre for Social and Policy Research.",
      currentRole: "Research Intern (CSPR)",
      currentFocus: ["Public Finance", "Indian Economy", "Data Analysis", "Research Communication"],
      linkedinUrl: "http://www.linkedin.com/in/dhanushmendu",
      email: "dhanush.mendu@example.com",
    },
  });

  // 4. Create base taxonomy & Skills
  const topicEcon = await prisma.topic.create({ data: { name: "Economic Policy", slug: "economic-policy" }});
  const topicData = await prisma.topic.create({ data: { name: "Data Analysis", slug: "data-analysis" }});
  const topicHealth = await prisma.topic.create({ data: { name: "Healthcare Policy", slug: "healthcare-policy" }});

  const getSkill = async (name: string, category: string) => {
    return prisma.skill.create({ data: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), category }});
  };

  const sStata = await getSkill("STATA", "Tools");
  const sR = await getSkill("R", "Tools");
  const sTableau = await getSkill("Tableau", "Tools");
  const sPowerBi = await getSkill("PowerBi", "Tools");
  const sEViews = await getSkill("EViews", "Tools");
  const sExcel = await getSkill("Excel", "Tools");
  const sOcr = await getSkill("Apple OCR", "Tools");
  const sPubFin = await getSkill("Public Finance", "Research");
  const sPubAcc = await getSkill("Public Account Auditing", "Research");
  const sResMeth = await getSkill("Research Methodology", "Research");
  
  // 5. Seed Projects
  const projKarnatFin = await prisma.project.create({
    data: {
      title: "Karnataka State Finance / Budget Analysis",
      slug: "karnataka-budget-analysis",
      subtitle: "Budget Rigidity & Efficiency Benchmarking",
      shortDescription: "Analysis of Karnataka's budget statements across 10 fiscal years. Derived insights on PPP sustainability, committed expenditure rigidity, and efficiency indices for health/education relative to peer states.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      organization: "CSPR",
      role: "Research Intern",
      startDate: new Date("2026-07-13"),
      projectType: "Fiscal Analysis",
      topics: { create: [{ topicId: topicEcon.id }, { topicId: topicData.id }] },
      skills: { create: [{ skillId: sExcel.id }, { skillId: sPubFin.id }] },
      blocks: [
        { type: "rich-text", content: "<p>Extracted state budget tables from official PDFs (2014-2026) for Andhra, Telangana, Tamil Nadu, and Karnataka. Computed 10-year CAGRs, modeled the Committed Expenditure Ratio (salaries + pensions + interest), and built an efficiency index using ASER/NFHS datasets.</p>" },
        { type: "link", title: "Project Spreadsheet (Internal/Working)", url: "https://docs.google.com/spreadsheets/d/13yQR17SYohaibGtLHrarExZuj1ceosoc/edit" }
      ]
    }
  });

  const projNfhs = await prisma.project.create({
    data: {
      title: "Karnataka NFHS-6 / Data Speaks",
      slug: "karnataka-nfhs6-dataspeaks",
      subtitle: "Demographic Anomalies & Health Disparities",
      shortDescription: "Visual exploration of the NFHS-6 dataset focusing on Karnataka's health markers, urban-rural convergence, and anomalies in reported rates.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      organization: "CSPR",
      startDate: new Date("2026-07-20"),
      topics: { create: [{ topicId: topicData.id }, { topicId: topicHealth.id }] },
      skills: { create: [{ skillId: sTableau.id }, { skillId: sStata.id }, { skillId: sResMeth.id }] },
      blocks: [
        { type: "rich-text", content: "<p>Analyzed dropping rates in Gender Based Violence (shelved for lack of causal link structure) and rising C-Section adoption. Validated data against WHO 15% threshold limits and created comparative Tableau dashboards.</p>" },
        { type: "link", title: "NFHS-6 Fact Sheets", url: "https://www.nfhsiips.in/nfhsuser/assets/National%20Family%20Health%20Survey%20(NFHS-6)%202023-2024%20Fact%20Sheets.pdf" }
      ]
    }
  });

  const projColNfhs = await prisma.project.create({
    data: {
      title: "Insurance, C-Sections & Health-System Analysis",
      slug: "health-system-csection-insurance",
      subtitle: "Policy Incentives and Healthcare Outcomes",
      shortDescription: "Investigated quantitative relationships between insurance institution frameworks (claim structures, IRDAI policies) and increasing rates of surgical deliveries in Karnataka.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      startDate: new Date("2026-07-27"),
      topics: { create: [{ topicId: topicHealth.id }, { topicId: topicEcon.id }] },
      skills: { create: [{ skillId: sTableau.id }, { skillId: sStata.id }] },
      blocks: [
        { type: "rich-text", content: "<p>Deep dive into microdata to establish quantitative links. Workstreams covered: Insurance-Provider link, State Benchmarking, Regulatory mapping (IRDAI), and Fertility Data mapping.</p>" },
        { type: "link", title: "WHO Robson Classification", url: "https://www.who.int/publications/i/item/9789241513197" }
      ]
    }
  });

  const projTelangana = await prisma.project.create({
    data: {
      title: "Telangana Fiscal Health / Broader Fiscal Liability Analysis",
      slug: "telangana-fiscal-health",
      shortDescription: "Consolidated multiple years of Telangana Budgets and CAG reports into structured datasets covering public debt, SPV guarantees, and off-budget borrowing.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      startDate: new Date("2026-08-17"),
      topics: { create: [{ topicId: topicEcon.id }] },
      skills: { create: [{ skillId: sPubFin.id }, { skillId: sPubAcc.id }] },
      blocks: [
        { type: "rich-text", content: "<p>Developed a structured Telangana fiscal-health dataset and entity-level guarantee/SPV database. Moved beyond simple Debt/GSDP ratios towards a comprehensive Fiscal Liability Index by treating legal ownership vs. economic incidence distinctively.</p>" }
      ]
    }
  });

  const projKerala = await prisma.project.create({
    data: {
      title: "Kerala State Finance Status Report Reproduction",
      slug: "kerala-finance-reproduction",
      subtitle: "Automation and Framework Scaling",
      shortDescription: "Created a replicable automated process for reproducing the Kerala State Finance Status Report framework for Telangana and Karnataka.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      startDate: new Date("2026-08-24"),
      topics: { create: [{ topicId: topicData.id }] },
      skills: { create: [{ skillId: sOcr.id }] },
      blocks: [
        { type: "rich-text", content: "<p>Experimented with Apple OCR, Python, and Swift integration to extract complex tables from difficult source documents, finalizing Chapter 1 and establishing a continuous workflow for Chapter 2.</p>" }
      ]
    }
  });

  const projSouth = await prisma.project.create({
    data: {
      title: "Southern-State Fiscal Data / Research Workflow",
      slug: "southern-state-fiscal-workflow",
      shortDescription: "Developed standards and workflows for comparative fiscal studies across southern states as part of the core CSPR team.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      startDate: new Date("2026-08-24"),
      topics: { create: [{ topicId: topicEcon.id }] },
      skills: { create: [{ skillId: sResMeth.id }] }
    }
  });

  // 6. Seed Journal Entries
  await prisma.journalEntry.create({
    data: {
      weekNumber: 2,
      startDate: new Date("2026-07-13"),
      endDate: new Date("2026-07-19"),
      title: "Week 2: Karnataka Budget Analysis & Data Ingestion",
      focus: "Getting acquainted with CSPR's vision and mission. Compilation of monthly time series data and extraction of Karnataka's budget tables.",
      workCompleted: "- Compiled monthly time series data (2014-2026) covering over 50 fiscal variables for southern states.\n- Extracted Karnataka state budget tables using Tabula and Excel OCR.\n- Modeled Committed Expenditure Ratio and built efficiency indices benchmarking Karnataka.\n- Led team coordination for smooth task assignments.",
      reflection: "Win: Team cohesion and smooth execution. Challenge: District data extraction required OCR and scripting. Learned: Budget structures, committed expenditure nuances, and identifying local fiscal flexibility.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      projects: { create: [{ projectId: projKarnatFin.id }] },
      skills: { create: [{ skillId: sExcel.id }, { skillId: sPubFin.id }] }
    }
  });

  await prisma.journalEntry.create({
    data: {
      weekNumber: 3,
      startDate: new Date("2026-07-20"),
      endDate: new Date("2026-07-26"),
      title: "Week 3: NFHS-6 Exploration & Identification",
      focus: "Understanding the Karnataka state scan report (Data Speaks). Generating insights from the NFHS-6 factsheet.",
      workCompleted: "- Deep dived into NFHS-6 indicators, specifically on Gender Based Violence (dropped 44% to 14%) and rising C-Sections.\n- Corroborated C-section data with WHO limits (>15%).\n- Examined urban-rural differentials and public vs private healthcare disparities.",
      reflection: "Win: Faculty appreciation for astute data identification. Challenge: Pitched GBV idea but shelved it due to lack of causal strength to pursue health/insurance instead. Learned: NFHS survey methodologies and routing.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      projects: { create: [{ projectId: projNfhs.id }] },
      skills: { create: [{ skillId: sResMeth.id }] }
    }
  });

  await prisma.journalEntry.create({
    data: {
      weekNumber: 4,
      startDate: new Date("2026-07-27"),
      endDate: new Date("2026-08-02"),
      title: "Week 4: Insurance & C-Sections Causal Analysis",
      focus: "Data analysis cross-checking NCRB crime data vs GBV numbers, and shifting toward a strong causal visualization on Insurance & C-Sections.",
      workCompleted: "- Assessed HMIS and IRDAI databases for Karnataka.\n- Split team into 4 parallel workstreams: Insurance-Provider links, State Benchmarking, Regulatory mapping, and Fertility data.\n- Polished microdata analysis using Tableau and STATA to deliver striking visuals for CSPR's Data Speaks column.",
      reflection: "Win: Produced highly intuitive and beautiful visualizations. Navigated iterations translating heavy econometric regressions into accessible policy insights. Learned: Balancing scientific rigor with communicative ease; advanced Tableau visualizations.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      projects: { create: [{ projectId: projNfhs.id }, { projectId: projColNfhs.id }] },
      skills: { create: [{ skillId: sTableau.id }, { skillId: sStata.id }] }
    }
  });

  await prisma.journalEntry.create({
    data: {
      weekNumber: 7,
      startDate: new Date("2026-08-17"),
      endDate: new Date("2026-08-23"),
      title: "Week 7: Telangana Fiscal Health & Liability Auditing",
      focus: "Acquiring Telangana indicators on fiscal debt, SPVs, capital accumulation, and FRBM compliance. Began managing Monthly Spotlight.",
      workCompleted: "- Computed Debt burden, Guarantee burden, and Own Revenue Strength ratios.\n- Manually scraped data from Debt & Guarantees Vol V/2, FRBM material, and CAG State Finance audits.\n- Built an entity-level guarantee/SPV database documenting sanctioned vs. outstanding exposure.\n- Overcame missing recent detailed classifications by relying on CAG's off-budget borrowing analysis.",
      reflection: "Win: Laid benchmarks for historical comparison. Challenge: Fiscal info scattered across volumes with differing categorizations; synthesized them carefully without unsupported assumptions. Learned: Legal ownership of debt vs economic incidence.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      projects: { create: [{ projectId: projTelangana.id }] },
      skills: { create: [{ skillId: sPubAcc.id }, { skillId: sPubFin.id }] }
    }
  });

  await prisma.journalEntry.create({
    data: {
      weekNumber: 8,
      startDate: new Date("2026-08-24"),
      endDate: new Date("2026-08-30"),
      title: "Week 8: Core Team Operations & Kerala Framework",
      focus: "Deepening Telangana's fiscal analysis, taking ownership of broader Southern-state comparative research, and expanding data-vis capabilities.",
      workCompleted: "- Calculated debt sustainability ratios linked to infrastructure spending.\n- Interrogated major SPVs and started reviewing Kaleshwaram CAG reports.\n- Joined CSPR Core Team, managing intra-team recruiting and cross-state workflow standards.\n- Prototyped a reproduction pipeline for the Kerala Status Report on State Finances using Apple OCR + Python.",
      reflection: "Win: Evolved from data extraction to interpreting fiscal sustainability. Formalized Core Team management. Challenge: Reproducing external tables required complex OCR and Python integration. Learned: Nuances of assessing infrastructure growth against debt expansion.",
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      projects: { create: [{ projectId: projTelangana.id }, { projectId: projKerala.id }, { projectId: projSouth.id }] },
      skills: { create: [{ skillId: sOcr.id }, { skillId: sPubFin.id }] }
    }
  });

  console.log("Seed completed successfully with realistic portfolio structure!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
