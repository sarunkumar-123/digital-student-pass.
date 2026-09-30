import {
  pgTable,
  varchar,
  text,
  date,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: varchar("id").primaryKey(),
  studentId: varchar("student_id").notNull().unique(),
  name: varchar("name").notNull(),
  password: varchar("password").notNull(),
  photo: text("photo"),
  dob: date("dob"),
  phone: varchar("phone"),
  email: varchar("email"),
  college: varchar("college").notNull(),
  course: varchar("course"),
  year: varchar("year"),
  status: varchar("status").default("active"),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey(),
  applicationId: varchar("application_id").notNull().unique(),
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name").notNull(),
  college: varchar("college").notNull(),
  course: varchar("course"),
  year: varchar("year"),
  academicYear: varchar("academic_year"),
  origin: varchar("origin").notNull(),
  destination: varchar("destination").notNull(),
  phone: varchar("phone"),
  email: varchar("email"),
  dob: date("dob"),
  status: varchar("status").default("pending_college"),
  collegeVerification: varchar("college_verification").default("pending"),
  mtcApproval: varchar("mtc_approval").default("pending"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const passes = pgTable("passes", {
  id: varchar("id").primaryKey(),
  passId: varchar("pass_id").notNull().unique(),
  studentId: varchar("student_id").notNull(),
  passType: varchar("pass_type").default("College Student Concession Ticket"),
  origin: varchar("origin").notNull(),
  destination: varchar("destination").notNull(),
  validityStart: date("validity_start").notNull(),
  validityEnd: date("validity_end").notNull(),
  status: varchar("status").default("active"),
  monthlyAmount: integer("monthly_amount").default(280),
  stages: integer("stages").default(10),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey(),
  transactionId: varchar("transaction_id").notNull().unique(),
  studentId: varchar("student_id").notNull(),
  amount: integer("amount").notNull(),
  paymentMethod: varchar("payment_method"),
  paymentStatus: varchar("payment_status").default("pending"),
  refundStatus: varchar("refund_status"),
  date: timestamp("date").defaultNow(),
  purpose: varchar("purpose"),
});

export const journeys = pgTable("journeys", {
  id: varchar("id").primaryKey(),
  journeyId: varchar("journey_id").notNull().unique(),
  studentId: varchar("student_id").notNull(),
  route: varchar("route").notNull(),
  bus: varchar("bus").notNull(),
  date: date("date").notNull(),
  time: varchar("time").notNull(),
  syncStatus: varchar("sync_status").default("synced"),
});

export const routeChangeRequests = pgTable("route_change_requests", {
  id: varchar("id").primaryKey(),
  requestId: varchar("request_id").notNull().unique(),
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name").notNull(),
  oldOrigin: varchar("old_origin").notNull(),
  oldDestination: varchar("old_destination").notNull(),
  newOrigin: varchar("new_origin").notNull(),
  newDestination: varchar("new_destination").notNull(),
  reason: text("reason"),
  collegeStatus: varchar("college_status").default("pending"),
  mtcStatus: varchar("mtc_status").default("pending"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey(),
  notificationId: varchar("notification_id").notNull().unique(),
  studentId: varchar("student_id").notNull(),
  message: text("message").notNull(),
  type: varchar("type"),
  date: timestamp("date").defaultNow(),
  read: boolean("read").default(false),
});

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey(),
  ticketId: varchar("ticket_id").notNull().unique(),
  studentId: varchar("student_id"),
  issueType: varchar("issue_type").notNull(),
  description: text("description").notNull(),
  applicationId: varchar("application_id"),
  contactNumber: varchar("contact_number"),
  status: varchar("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});
