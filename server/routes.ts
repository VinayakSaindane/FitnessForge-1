import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBookingSchema, insertContactSchema, insertTestimonialSchema, insertPersonalTrainingSessionSchema } from "@shared/schema";
import { z } from "zod";

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public routes
  app.get("/api/classes", async (req, res) => {
    try {
      const type = req.query.type as string;
      const classes = type 
        ? await storage.getClassesByType(type)
        : await storage.getClasses();
      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.get("/api/class-schedules", async (req, res) => {
    try {
      const schedules = await storage.getClassSchedules();
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getTrainers();
      res.json(trainers);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      res.status(500).json({ message: "Failed to fetch trainers" });
    }
  });

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getPublicTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ message: "Contact form submitted successfully", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid form data", errors: error.errors });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Failed to submit contact form" });
      }
    }
  });

  // Protected routes (require authentication)
  app.get("/api/my-bookings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/book-class", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId,
      });

      // Check availability
      const availability = await storage.checkClassAvailability(
        bookingData.classId!, 
        bookingData.scheduleId!
      );

      if (!availability.available) {
        return res.status(400).json({ message: "Class is full" });
      }

      const booking = await storage.createBooking(bookingData);
      res.json({ message: "Class booked successfully", booking });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      } else {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Failed to book class" });
      }
    }
  });

  app.delete("/api/bookings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.cancelBooking(bookingId);
      res.json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Failed to cancel booking" });
    }
  });

  app.get("/api/class-availability/:classId/:scheduleId", async (req, res) => {
    try {
      const classId = parseInt(req.params.classId);
      const scheduleId = parseInt(req.params.scheduleId);
      const availability = await storage.checkClassAvailability(classId, scheduleId);
      res.json(availability);
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  app.post("/api/personal-training", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertPersonalTrainingSessionSchema.parse({
        ...req.body,
        userId,
      });

      const session = await storage.createPersonalTrainingSession(sessionData);
      res.json({ message: "Personal training session booked successfully", session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid session data", errors: error.errors });
      } else {
        console.error("Error booking personal training:", error);
        res.status(500).json({ message: "Failed to book personal training session" });
      }
    }
  });

  app.get("/api/my-personal-training", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserPersonalTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching personal training sessions:", error);
      res.status(500).json({ message: "Failed to fetch personal training sessions" });
    }
  });

  app.post("/api/testimonials", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        userId,
      });

      const testimonial = await storage.createTestimonial(testimonialData);
      res.json({ message: "Testimonial submitted successfully", testimonial });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      } else {
        console.error("Error creating testimonial:", error);
        res.status(500).json({ message: "Failed to submit testimonial" });
      }
    }
  });

  // Stripe payment routes for membership subscriptions
  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
    return res.status(503).json({ 
      message: "Payment processing is temporarily unavailable. Please contact support to set up your membership." 
    });
  });

  // Admin routes (basic implementation)
  app.get("/api/admin/bookings", isAuthenticated, async (req: any, res) => {
    try {
      // Simple admin check - in production, you'd want proper role-based access
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.email?.includes('admin')) {
        const bookings = await storage.getBookings();
        res.json(bookings);
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/contacts", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.email?.includes('admin')) {
        const contacts = await storage.getContacts();
        res.json(contacts);
      } else {
        res.status(403).json({ message: "Admin access required" });
      }
    } catch (error) {
      console.error("Error fetching admin contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
