import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  membershipType: varchar("membership_type").default("none"), // none, basic, premium, elite
  membershipStatus: varchar("membership_status").default("inactive"), // active, inactive, cancelled
  phone: varchar("phone"),
  emergencyContact: varchar("emergency_contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trainers = pgTable("trainers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").unique().notNull(),
  specialties: text("specialties").array(),
  bio: text("bio"),
  experience: varchar("experience"),
  certifications: text("certifications").array(),
  imageUrl: varchar("image_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.0"),
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // hiit, yoga, strength, cardio, etc.
  intensity: varchar("intensity").notNull(), // low, medium, high
  duration: integer("duration").notNull(), // in minutes
  maxCapacity: integer("max_capacity").default(20),
  instructorId: integer("instructor_id").references(() => trainers.id),
  imageUrl: varchar("image_url"),
  price: decimal("price", { precision: 8, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const classSchedules = pgTable("class_schedules", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").references(() => classes.id),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  date: timestamp("date"), // for specific date schedules
  isRecurring: boolean("is_recurring").default(true),
  isActive: boolean("is_active").default(true),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  classId: integer("class_id").references(() => classes.id),
  scheduleId: integer("schedule_id").references(() => classSchedules.id),
  bookingDate: timestamp("booking_date").notNull(),
  status: varchar("status").default("confirmed"), // confirmed, cancelled, completed, no-show
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const personalTrainingSessions = pgTable("personal_training_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  trainerId: integer("trainer_id").references(() => trainers.id),
  sessionDate: timestamp("session_date").notNull(),
  duration: integer("duration").default(60), // in minutes
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled
  notes: text("notes"),
  price: decimal("price", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isApproved: boolean("is_approved").default(false),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: varchar("image_url"),
  category: varchar("category"),
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(false),
  authorId: varchar("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, responded, closed
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  personalTrainingSessions: many(personalTrainingSessions),
  testimonials: many(testimonials),
  blogPosts: many(blogPosts),
}));

export const trainersRelations = relations(trainers, ({ many }) => ({
  classes: many(classes),
  personalTrainingSessions: many(personalTrainingSessions),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  instructor: one(trainers, {
    fields: [classes.instructorId],
    references: [trainers.id],
  }),
  schedules: many(classSchedules),
  bookings: many(bookings),
}));

export const classSchedulesRelations = relations(classSchedules, ({ one, many }) => ({
  class: one(classes, {
    fields: [classSchedules.classId],
    references: [classes.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [bookings.classId],
    references: [classes.id],
  }),
  schedule: one(classSchedules, {
    fields: [bookings.scheduleId],
    references: [classSchedules.id],
  }),
}));

export const personalTrainingSessionsRelations = relations(personalTrainingSessions, ({ one }) => ({
  user: one(users, {
    fields: [personalTrainingSessions.userId],
    references: [users.id],
  }),
  trainer: one(trainers, {
    fields: [personalTrainingSessions.trainerId],
    references: [trainers.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainerSchema = createInsertSchema(trainers).omit({
  id: true,
  createdAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
});

export const insertClassScheduleSchema = createInsertSchema(classSchedules).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertPersonalTrainingSessionSchema = createInsertSchema(personalTrainingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Trainer = typeof trainers.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type ClassSchedule = typeof classSchedules.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type PersonalTrainingSession = typeof personalTrainingSessions.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Contact = typeof contacts.$inferSelect;

export type InsertTrainer = z.infer<typeof insertTrainerSchema>;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type InsertClassSchedule = z.infer<typeof insertClassScheduleSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertPersonalTrainingSession = z.infer<typeof insertPersonalTrainingSessionSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
