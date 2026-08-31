import { PrismaClient, ProjectStatus, Visibility } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const publishedVisibleData = {
    status: ProjectStatus.PUBLISHED, 
    visibility: Visibility.PUBLIC
  };

  const article = await prisma.article.upsert({
    where: { slug: "evaluating-subnational-welfare-dynamics" },
    update: { ...publishedVisibleData },
    create: {
      title: "Evaluating Subnational Welfare Dynamics",
      slug: "evaluating-subnational-welfare-dynamics",
      subtitle: "A framework for modeling fiscal policy outcomes in local economies.",
      content: [
        {
          id: "block-a1",
          type: "heading",
          level: 2,
          content: "The Methodological Baseline"
        },
        {
          id: "block-a2",
          type: "rich-text",
          content: "<p>The integration of varied data streams across overlapping bureaucratic authorities remains one of the primary hurdles in empirical subnational policy analysis. A robust methodological baseline requires isolating specific transfer mechanisms while controlling for concurrent regional policy shifts.</p>"
        },
        {
          id: "block-a3",
          type: "callout",
          variant: "finding",
          title: "Core Thesis",
          content: "State-level intervention pathways exhibit a multi-year lag due to administrative rigidities, making real-time efficacy analysis prone to Type I errors unless specifically adjusted."
        },
        {
          id: "block-a4",
          type: "heading",
          level: 3,
          content: "Empirical Framework"
        },
        {
          id: "block-a5",
          type: "table",
          headers: ["Policy Mechanism", "Estimated Lag", "Data Availability"],
          rows: [
            ["Direct Capital Transfers", "1-2 Fiscal Years", "High (Quarterly)"],
            ["Block Grants (Flexible)", "2-3 Fiscal Years", "Medium (Annual)"],
            ["Tax Incentive Models", "4+ Fiscal Years", "Low (Biennial)"]
          ],
          caption: "Categorization of lag structures across three standard welfare intervention models."
        }
      ],
      status: ProjectStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
      publishedAt: new Date("2024-06-21")
    }
  });

  // Attach to topics
  const topicData = await prisma.topic.findUnique({ where: { slug: "data-analysis" } });
  const topicEcon = await prisma.topic.findUnique({ where: { slug: "economic-policy" } });
  
  if (topicData && topicEcon) {
    await prisma.articleTopic.createMany({
      data: [
        { articleId: article.id, topicId: topicData.id },
        { articleId: article.id, topicId: topicEcon.id }
      ],
      skipDuplicates: true
    });
  }

  // Update existing project to have rich blocks
  await prisma.project.updateMany({
    where: { slug: "minimum-wage-impact-analysis" },
    data: {
      blocks: [
        {
          id: "block-p1",
          type: "methodology",
          title: "Difference-in-Differences Setup",
          content: "<p>We constructed a generalized difference-in-differences (DiD) model exploiting the variance in county-level minimum wage adoption timelines within the state. A core concern was pre-existing divergence in county employment trends.</p>"
        },
        {
          id: "block-p2",
          type: "metric",
          label: "Treatment Counties",
          value: "14",
          change: "Out of 58 total",
          changeDirection: "neutral"
        },
        {
          id: "block-p3",
          type: "key-finding",
          finding: "No statistically significant aggregate disemployment effects were detected in retail clusters within 12 months post-implementation.",
          evidence: "Employment variances remained within a standard error of 0.04 across control and treated units.",
          implication: "Local labor markets may absorb moderate wage floors through alternative channels (e.g., price pass-through, reduced turnover) rather than immediate headcount reductions."
        }
      ]
    }
  });

  console.log("Seed updated successfully with rich blocks!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
