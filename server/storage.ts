import {
  users,
  trainers,
  classes,
  classSchedules,
  bookings,
  personalTrainingSessions,
  testimonials,
  blogPosts,
  contacts,
  type User,
  type UpsertUser,
  type Trainer,
  type Class,
  type ClassSchedule,
  type Booking,
  type PersonalTrainingSession,
  type Testimonial,
  type BlogPost,
  type Contact,
  type InsertTrainer,
  type InsertClass,
  type InsertClassSchedule,
  type InsertBooking,
  type InsertPersonalTrainingSession,
  type InsertTestimonial,
  type InsertBlogPost,
  type InsertContact,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Trainer operations
  getTrainers(): Promise<Trainer[]>;
  getTrainer(id: number): Promise<Trainer | undefined>;
  createTrainer(trainer: InsertTrainer): Promise<Trainer>;
  updateTrainer(id: number, trainer: Partial<InsertTrainer>): Promise<Trainer>;
  
  // Class operations
  getClasses(): Promise<(Class & { instructor: Trainer | null })[]>;
  getClass(id: number): Promise<(Class & { instructor: Trainer | null }) | undefined>;
  getClassesByType(type: string): Promise<(Class & { instructor: Trainer | null })[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, classData: Partial<InsertClass>): Promise<Class>;
  
  // Class schedule operations
  getClassSchedules(): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } })[]>;
  getClassSchedule(id: number): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } }) | undefined>;
  createClassSchedule(schedule: InsertClassSchedule): Promise<ClassSchedule>;
  
  // Booking operations
  getBookings(): Promise<(Booking & { user: User | null; class: Class | null; schedule: ClassSchedule | null })[]>;
  getUserBookings(userId: string): Promise<(Booking & { class: Class & { instructor: Trainer | null }; schedule: ClassSchedule })[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  cancelBooking(id: number): Promise<Booking>;
  checkClassAvailability(classId: number, scheduleId: number): Promise<{ available: boolean; spotsRemaining: number }>;
  
  // Personal training operations
  getPersonalTrainingSessions(): Promise<(PersonalTrainingSession & { user: User | null; trainer: Trainer | null })[]>;
  getUserPersonalTrainingSessions(userId: string): Promise<(PersonalTrainingSession & { trainer: Trainer })[]>;
  createPersonalTrainingSession(session: InsertPersonalTrainingSession): Promise<PersonalTrainingSession>;
  
  // Testimonial operations
  getPublicTestimonials(): Promise<(Testimonial & { user: User | null })[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Blog operations
  getPublishedBlogPosts(): Promise<(BlogPost & { author: User | null })[]>;
  getBlogPost(slug: string): Promise<(BlogPost & { author: User | null }) | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId, 
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Trainer operations
  async getTrainers(): Promise<Trainer[]> {
    return await db.select().from(trainers).where(eq(trainers.isActive, true)).orderBy(asc(trainers.name));
  }

  async getTrainer(id: number): Promise<Trainer | undefined> {
    const [trainer] = await db.select().from(trainers).where(eq(trainers.id, id));
    return trainer;
  }

  async createTrainer(trainer: InsertTrainer): Promise<Trainer> {
    const [newTrainer] = await db.insert(trainers).values(trainer).returning();
    return newTrainer;
  }

  async updateTrainer(id: number, trainer: Partial<InsertTrainer>): Promise<Trainer> {
    const [updatedTrainer] = await db
      .update(trainers)
      .set(trainer)
      .where(eq(trainers.id, id))
      .returning();
    return updatedTrainer;
  }

  // Class operations
  async getClasses(): Promise<(Class & { instructor: Trainer | null })[]> {
    return await db
      .select()
      .from(classes)
      .leftJoin(trainers, eq(classes.instructorId, trainers.id))
      .where(eq(classes.isActive, true))
      .orderBy(asc(classes.name))
      .then(results => results.map(result => ({
        ...result.classes,
        instructor: result.trainers,
      })));
  }

  async getClass(id: number): Promise<(Class & { instructor: Trainer | null }) | undefined> {
    const results = await db
      .select()
      .from(classes)
      .leftJoin(trainers, eq(classes.instructorId, trainers.id))
      .where(eq(classes.id, id));
    
    if (results.length === 0) return undefined;
    
    const result = results[0];
    return {
      ...result.classes,
      instructor: result.trainers,
    };
  }

  async getClassesByType(type: string): Promise<(Class & { instructor: Trainer | null })[]> {
    return await db
      .select()
      .from(classes)
      .leftJoin(trainers, eq(classes.instructorId, trainers.id))
      .where(and(eq(classes.type, type), eq(classes.isActive, true)))
      .orderBy(asc(classes.name))
      .then(results => results.map(result => ({
        ...result.classes,
        instructor: result.trainers,
      })));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class> {
    const [updatedClass] = await db
      .update(classes)
      .set(classData)
      .where(eq(classes.id, id))
      .returning();
    return updatedClass;
  }

  // Class schedule operations
  async getClassSchedules(): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } })[]> {
    return await db
      .select()
      .from(classSchedules)
      .leftJoin(classes, eq(classSchedules.classId, classes.id))
      .leftJoin(trainers, eq(classes.instructorId, trainers.id))
      .where(eq(classSchedules.isActive, true))
      .orderBy(asc(classSchedules.dayOfWeek), asc(classSchedules.startTime))
      .then(results => results.map(result => ({
        ...result.class_schedules,
        class: {
          ...result.classes!,
          instructor: result.trainers,
        },
      })));
  }

  async getClassSchedule(id: number): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } }) | undefined> {
    const results = await db
      .select()
      .from(classSchedules)
      .leftJoin(classes, eq(classSchedules.classId, classes.id))
      .leftJoin(trainers, eq(classes.instructorId, trainers.id))
      .where(eq(classSchedules.id, id));
    
    if (results.length === 0) return undefined;
    
    const result = results[0];
    return {
      ...result.class_schedules,
      class: {
        ...result.classes!,
        instructor: result.trainers,
      },
    };
  }

  async createClassSchedule(schedule: InsertClassSchedule): Promise<ClassSchedule> {
    const [newSchedule] = await db.insert(classSchedules).values(schedule).returning();
    return newSchedule;
  }

  // Booking operations
  async getBookings(): Promise<(Booking & { user: User | null; class: Class | null; schedule: ClassSchedule | null })[]> {
    return await db
      .select()
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(classes, eq(bookings.classId, classes.id))
      .leftJoin(classSchedules, eq(bookings.scheduleId, classSchedules.id))
      .orderBy(desc(bookings.createdAt))
      .then(results => results.map(result => ({
        ...result.bookings,
        user: result.users,
        class: result.classes,
        schedule: result.class_schedules,
      })));
  }

  async getUserBookings(userId: string): Promise<(Booking & { class: Class & { instructor: Trainer | null }; schedule: ClassSchedule })[]> {
    return await db
      .select()
      .from(bookings)
      .leftJoin(classes, eq(bookings.classId, classes.id))
      .leftJoin(trainers, eq(classes.instructorId, trainers.id))
      .leftJoin(classSchedules, eq(bookings.scheduleId, classSchedules.id))
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.bookingDate))
      .then(results => results.map(result => ({
        ...result.bookings,
        class: {
          ...result.classes!,
          instructor: result.trainers,
        },
        schedule: result.class_schedules!,
      })));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async cancelBooking(id: number): Promise<Booking> {
    const [cancelledBooking] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(eq(bookings.id, id))
      .returning();
    return cancelledBooking;
  }

  async checkClassAvailability(classId: number, scheduleId: number): Promise<{ available: boolean; spotsRemaining: number }> {
    const classInfo = await this.getClass(classId);
    if (!classInfo) {
      return { available: false, spotsRemaining: 0 };
    }

    const confirmedBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.classId, classId),
          eq(bookings.scheduleId, scheduleId),
          eq(bookings.status, "confirmed")
        )
      );

    const maxCapacity = classInfo.maxCapacity || 20;
    const spotsRemaining = maxCapacity - confirmedBookings.length;
    
    return {
      available: spotsRemaining > 0,
      spotsRemaining: Math.max(0, spotsRemaining),
    };
  }

  // Personal training operations
  async getPersonalTrainingSessions(): Promise<(PersonalTrainingSession & { user: User | null; trainer: Trainer | null })[]> {
    return await db
      .select()
      .from(personalTrainingSessions)
      .leftJoin(users, eq(personalTrainingSessions.userId, users.id))
      .leftJoin(trainers, eq(personalTrainingSessions.trainerId, trainers.id))
      .orderBy(desc(personalTrainingSessions.sessionDate))
      .then(results => results.map(result => ({
        ...result.personal_training_sessions,
        user: result.users,
        trainer: result.trainers,
      })));
  }

  async getUserPersonalTrainingSessions(userId: string): Promise<(PersonalTrainingSession & { trainer: Trainer })[]> {
    return await db
      .select()
      .from(personalTrainingSessions)
      .leftJoin(trainers, eq(personalTrainingSessions.trainerId, trainers.id))
      .where(eq(personalTrainingSessions.userId, userId))
      .orderBy(desc(personalTrainingSessions.sessionDate))
      .then(results => results.map(result => ({
        ...result.personal_training_sessions,
        trainer: result.trainers!,
      })));
  }

  async createPersonalTrainingSession(session: InsertPersonalTrainingSession): Promise<PersonalTrainingSession> {
    const [newSession] = await db.insert(personalTrainingSessions).values(session).returning();
    return newSession;
  }

  // Testimonial operations
  async getPublicTestimonials(): Promise<(Testimonial & { user: User | null })[]> {
    return await db
      .select()
      .from(testimonials)
      .leftJoin(users, eq(testimonials.userId, users.id))
      .where(and(eq(testimonials.isApproved, true), eq(testimonials.isPublic, true)))
      .orderBy(desc(testimonials.createdAt))
      .then(results => results.map(result => ({
        ...result.testimonials,
        user: result.users,
      })));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  // Blog operations
  async getPublishedBlogPosts(): Promise<(BlogPost & { author: User | null })[]> {
    return await db
      .select()
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.createdAt))
      .then(results => results.map(result => ({
        ...result.blog_posts,
        author: result.users,
      })));
  }

  async getBlogPost(slug: string): Promise<(BlogPost & { author: User | null }) | undefined> {
    const results = await db
      .select()
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug));
    
    if (results.length === 0) return undefined;
    
    const result = results[0];
    return {
      ...result.blog_posts,
      author: result.users,
    };
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  // Contact operations
  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
}

export const storage = new DatabaseStorage();
