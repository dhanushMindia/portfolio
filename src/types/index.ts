export * from "./blocks";

import { Project, Article, JournalEntry, Skill, Topic, User } from "@prisma/client";
import { ContentBlock } from "./blocks";

export interface ProjectWithRelations extends Omit<Project, "blocks"> {
  skills: Skill[];
  topics: Topic[];
  blocks: ContentBlock[];
  relatedProjects?: Project[];
}

export interface ArticleWithRelations extends Omit<Article, "content"> {
  topics: Topic[];
  content: ContentBlock[];
}

export interface JournalEntryWithRelations extends JournalEntry {
  topics: Topic[];
}

export interface SkillWithProjects extends Skill {
  projects: Project[];
}

export interface TopicWithRelations extends Topic {
  projects: Project[];
  articles: Article[];
  journalEntries: JournalEntry[];
}
