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

// Determine whether to use database-backed storage
const hasDatabase = Boolean(process.env.DATABASE_URL);

// Lazy import to avoid top-level await errors
const dbPromise: Promise<any> | null = hasDatabase
  ? import("./db").then((mod) => mod.db)
  : null;

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const db = await dbPromise!;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    return await db.select().from(trainers).where(eq(trainers.isActive, true)).orderBy(asc(trainers.name));
  }

  async getTrainer(id: number): Promise<Trainer | undefined> {
    const db = await dbPromise!;
    const [trainer] = await db.select().from(trainers).where(eq(trainers.id, id));
    return trainer;
  }

  async createTrainer(trainer: InsertTrainer): Promise<Trainer> {
    const db = await dbPromise!;
    const [newTrainer] = await db.insert(trainers).values(trainer).returning();
    return newTrainer;
  }

  async updateTrainer(id: number, trainer: Partial<InsertTrainer>): Promise<Trainer> {
    const db = await dbPromise!;
    const [updatedTrainer] = await db
      .update(trainers)
      .set(trainer)
      .where(eq(trainers.id, id))
      .returning();
    return updatedTrainer;
  }

  // Class operations
  async getClasses(): Promise<(Class & { instructor: Trainer | null })[]> {
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class> {
    const db = await dbPromise!;
    const [updatedClass] = await db
      .update(classes)
      .set(classData)
      .where(eq(classes.id, id))
      .returning();
    return updatedClass;
  }

  // Class schedule operations
  async getClassSchedules(): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } })[]> {
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    const [newSchedule] = await db.insert(classSchedules).values(schedule).returning();
    return newSchedule;
  }

  // Booking operations
  async getBookings(): Promise<(Booking & { user: User | null; class: Class | null; schedule: ClassSchedule | null })[]> {
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async cancelBooking(id: number): Promise<Booking> {
    const db = await dbPromise!;
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

    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    const [newSession] = await db.insert(personalTrainingSessions).values(session).returning();
    return newSession;
  }

  // Testimonial operations
  async getPublicTestimonials(): Promise<(Testimonial & { user: User | null })[]> {
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    const [newTestimonial] = await db.insert(testimonials).values(testimonial).returning();
    return newTestimonial;
  }

  // Blog operations
  async getPublishedBlogPosts(): Promise<(BlogPost & { author: User | null })[]> {
    const db = await dbPromise!;
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
    const db = await dbPromise!;
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
    const db = await dbPromise!;
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  // Contact operations
  async createContact(contact: InsertContact): Promise<Contact> {
    const db = await dbPromise!;
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    const db = await dbPromise!;
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
}

// In-memory fallback storage for development without a database
class MemoryStorage implements IStorage {
  private users: User[] = [];
  private trainers: Trainer[] = [];
  private classes: Class[] = [];
  private classSchedules: ClassSchedule[] = [];
  private bookings: Booking[] = [];
  private personalTrainingSessions: PersonalTrainingSession[] = [];
  private testimonials: Testimonial[] = [];
  private blogPosts: BlogPost[] = [];
  private contacts: Contact[] = [];

  private trainerId = 1;
  private classId = 1;
  private scheduleId = 1;
  private bookingId = 1;
  private ptId = 1;
  private testimonialId = 1;
  private blogId = 1;
  private contactId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = await this.getUser(userData.id!);
    if (existing) {
      const updated: User = { ...existing, ...userData, updatedAt: new Date() as any };
      this.users = this.users.map(u => u.id === existing.id ? updated : u);
      return updated;
    }
    const created: User = {
      id: userData.id!,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      stripeCustomerId: null as any,
      stripeSubscriptionId: null as any,
      membershipType: ("none" as any),
      membershipStatus: ("inactive" as any),
      phone: null as any,
      emergencyContact: null as any,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    };
    this.users.push(created);
    return created;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    const updated: User = { ...user, stripeCustomerId: stripeCustomerId as any, stripeSubscriptionId: stripeSubscriptionId as any, updatedAt: new Date() as any };
    this.users = this.users.map(u => u.id === userId ? updated : u);
    return updated;
  }

  async getTrainers(): Promise<Trainer[]> { return this.trainers.filter(t => (t as any).isActive ?? true).sort((a,b)=> (a.name||"").localeCompare(b.name||"")); }
  async getTrainer(id: number): Promise<Trainer | undefined> { return this.trainers.find(t => (t as any).id === id); }
  async createTrainer(trainer: InsertTrainer): Promise<Trainer> {
    const created: Trainer = { ...(trainer as any), id: this.trainerId++, createdAt: new Date() as any } as any;
    this.trainers.push(created);
    return created;
  }
  async updateTrainer(id: number, trainer: Partial<InsertTrainer>): Promise<Trainer> {
    const existing = await this.getTrainer(id);
    if (!existing) throw new Error("Trainer not found");
    const updated = { ...existing, ...trainer } as Trainer;
    this.trainers = this.trainers.map(t => (t as any).id === id ? updated : t);
    return updated;
  }

  async getClasses(): Promise<(Class & { instructor: Trainer | null })[]> {
    return this.classes.filter(c => (c as any).isActive ?? true).map(c => ({ ...c, instructor: this.trainers.find(t => (t as any).id === (c as any).instructorId) ?? null } as any));
  }
  async getClass(id: number): Promise<(Class & { instructor: Trainer | null }) | undefined> {
    const cls = this.classes.find(c => (c as any).id === id);
    if (!cls) return undefined;
    return { ...cls, instructor: this.trainers.find(t => (t as any).id === (cls as any).instructorId) ?? null } as any;
  }
  async getClassesByType(type: string): Promise<(Class & { instructor: Trainer | null })[]> {
    return this.classes.filter(c => (c as any).type === type && ((c as any).isActive ?? true)).map(c => ({ ...c, instructor: this.trainers.find(t => (t as any).id === (c as any).instructorId) ?? null } as any));
  }
  async createClass(classData: InsertClass): Promise<Class> {
    const created: Class = { ...(classData as any), id: this.classId++, createdAt: new Date() as any } as any;
    this.classes.push(created);
    return created;
  }
  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class> {
    const existing = this.classes.find(c => (c as any).id === id);
    if (!existing) throw new Error("Class not found");
    const updated = { ...existing, ...classData } as Class;
    this.classes = this.classes.map(c => (c as any).id === id ? updated : c);
    return updated;
  }

  async getClassSchedules(): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } })[]> {
    return this.classSchedules.filter(s => (s as any).isActive ?? true).map(s => ({
      ...(s as any),
      class: { ...(this.classes.find(c => (c as any).id === (s as any).classId) as any), instructor: null } as any,
    }));
  }
  async getClassSchedule(id: number): Promise<(ClassSchedule & { class: Class & { instructor: Trainer | null } }) | undefined> {
    const s = this.classSchedules.find(cs => (cs as any).id === id);
    if (!s) return undefined;
    const cls = this.classes.find(c => (c as any).id === (s as any).classId)!;
    return { ...(s as any), class: { ...cls, instructor: this.trainers.find(t => (t as any).id === (cls as any).instructorId) ?? null } as any } as any;
  }
  async createClassSchedule(schedule: InsertClassSchedule): Promise<ClassSchedule> {
    const created: ClassSchedule = { ...(schedule as any), id: this.scheduleId++ } as any;
    this.classSchedules.push(created);
    return created;
  }

  async getBookings(): Promise<(Booking & { user: User | null; class: Class | null; schedule: ClassSchedule | null })[]> {
    return this.bookings.map(b => ({
      ...b,
      user: this.users.find(u => u.id === (b as any).userId) ?? null,
      class: this.classes.find(c => (c as any).id === (b as any).classId) ?? null,
      schedule: this.classSchedules.find(s => (s as any).id === (b as any).scheduleId) ?? null,
    }));
  }
  async getUserBookings(userId: string): Promise<(Booking & { class: Class & { instructor: Trainer | null }; schedule: ClassSchedule })[]> {
    return this.bookings.filter(b => (b as any).userId === userId).map(b => ({
      ...b,
      class: { ...(this.classes.find(c => (c as any).id === (b as any).classId) as any), instructor: null } as any,
      schedule: this.classSchedules.find(s => (s as any).id === (b as any).scheduleId)!,
    }));
  }
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const created: Booking = { ...(booking as any), id: this.bookingId++, createdAt: new Date() as any } as any;
    this.bookings.push(created);
    return created;
  }
  async cancelBooking(id: number): Promise<Booking> {
    const existing = this.bookings.find(b => (b as any).id === id);
    if (!existing) throw new Error("Booking not found");
    const updated = { ...existing, status: "cancelled" } as any;
    this.bookings = this.bookings.map(b => (b as any).id === id ? updated : b);
    return updated as any;
  }
  async checkClassAvailability(classId: number, scheduleId: number): Promise<{ available: boolean; spotsRemaining: number; }> {
    const cls = this.classes.find(c => (c as any).id === classId);
    const maxCapacity = (cls as any)?.maxCapacity ?? 20;
    const confirmed = this.bookings.filter(b => (b as any).classId === classId && (b as any).scheduleId === scheduleId && (b as any).status === "confirmed").length;
    const spotsRemaining = Math.max(0, maxCapacity - confirmed);
    return { available: spotsRemaining > 0, spotsRemaining };
  }

  async getPersonalTrainingSessions(): Promise<(PersonalTrainingSession & { user: User | null; trainer: Trainer | null })[]> {
    return this.personalTrainingSessions.map(s => ({ ...s, user: this.users.find(u => u.id === (s as any).userId) ?? null, trainer: this.trainers.find(t => (t as any).id === (s as any).trainerId) ?? null }));
  }
  async getUserPersonalTrainingSessions(userId: string): Promise<(PersonalTrainingSession & { trainer: Trainer })[]> {
    return this.personalTrainingSessions.filter(s => (s as any).userId === userId).map(s => ({ ...s, trainer: this.trainers.find(t => (t as any).id === (s as any).trainerId)! } as any));
  }
  async createPersonalTrainingSession(session: InsertPersonalTrainingSession): Promise<PersonalTrainingSession> {
    const created: PersonalTrainingSession = { ...(session as any), id: this.ptId++, createdAt: new Date() as any } as any;
    this.personalTrainingSessions.push(created);
    return created;
  }

  async getPublicTestimonials(): Promise<(Testimonial & { user: User | null })[]> {
    return this.testimonials.filter(t => ((t as any).isApproved ?? true) && ((t as any).isPublic ?? true)).map(t => ({ ...t, user: this.users.find(u => u.id === (t as any).userId) ?? null }));
  }
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const created: Testimonial = { ...(testimonial as any), id: this.testimonialId++, createdAt: new Date() as any } as any;
    this.testimonials.push(created);
    return created;
  }

  async getPublishedBlogPosts(): Promise<(BlogPost & { author: User | null })[]> {
    return this.blogPosts.filter(p => (p as any).isPublished ?? true).map(p => ({ ...p, author: this.users.find(u => u.id === (p as any).authorId) ?? null }));
  }
  async getBlogPost(slug: string): Promise<(BlogPost & { author: User | null }) | undefined> {
    const post = this.blogPosts.find(p => (p as any).slug === slug);
    if (!post) return undefined;
    return { ...post, author: this.users.find(u => u.id === (post as any).authorId) ?? null } as any;
  }
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const created: BlogPost = { ...(post as any), id: this.blogId++, createdAt: new Date() as any, updatedAt: new Date() as any } as any;
    this.blogPosts.push(created);
    return created;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const created: Contact = { ...(contact as any), id: this.contactId++, createdAt: new Date() as any } as any;
    this.contacts.push(created);
    return created;
  }
  async getContacts(): Promise<Contact[]> { return this.contacts.slice().sort((a,b) => ((b as any).createdAt as any) - ((a as any).createdAt as any)); }
}

export const storage: IStorage = hasDatabase ? new DatabaseStorage() : new MemoryStorage();
