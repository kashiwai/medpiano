import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  projectType: text("project_type").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  message: text("message").notNull(),
  referencedTrack: text("referenced_track"),
  locale: text("locale").notNull().default("ja"),
  status: text("status").notNull().default("new"), // new | read | responded | archived
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
