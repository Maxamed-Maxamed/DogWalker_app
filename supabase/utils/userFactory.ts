/**
 * User factory utilities for creating typed user objects
 */

import type {
  Owner,
  Walker,
  User,
  WeeklySchedule,
} from "@/types";

/**
 * Creates an empty weekly schedule
 * @returns An empty WeeklySchedule object
 */
export const createEmptySchedule = (): WeeklySchedule => {
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };
};

/**
 * Type guard to validate Supabase user structure
 */
const isValidSupabaseUser = (user: unknown): user is Record<string, unknown> & { id: string; email: string; created_at: string } => {
  return (
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    typeof (user as Record<string, unknown>).id === "string" &&
    "email" in user &&
    typeof (user as Record<string, unknown>).email === "string" &&
    "created_at" in user &&
    typeof (user as Record<string, unknown>).created_at === "string"
  );
};

/**
 * Creates a new Owner user from Supabase user data
 * @param supabaseUser - The Supabase user object
 * @returns A new Owner object
 * @throws Error if required fields are missing
 */
export const createOwner = (supabaseUser: unknown): Owner => {
  if (!isValidSupabaseUser(supabaseUser)) {
    throw new Error("Invalid Supabase user object: missing id or email");
  }

  const createdAtDate = new Date(supabaseUser.created_at);
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt timestamp");
  }

  const userMetadata = supabaseUser.user_metadata as Record<string, unknown> | undefined;

  const owner: Owner = {
    id: supabaseUser.id,
    email: supabaseUser.email,
    role: "owner" as const,
    firstName: userMetadata?.firstName as string | undefined,
    lastName: userMetadata?.lastName as string | undefined,
    phone: userMetadata?.phone as string | undefined,
    photoUrl: userMetadata?.photoUrl as string | undefined,
    createdAt: createdAtDate,
    onboardingStatus: "not_started" as const,
    setupStatus: "not_started" as const,
    location: undefined,
    dogs: [],
    paymentMethods: [],
  };

  return owner;
};

/**
 * Creates a new Walker user from Supabase user data
 * @param supabaseUser - The Supabase user object
 * @returns A new Walker object
 * @throws Error if required fields are missing
 */
export const createWalker = (supabaseUser: unknown): Walker => {
  if (!isValidSupabaseUser(supabaseUser)) {
    throw new Error("Invalid Supabase user object: missing id or email");
  }

  const createdAtDate = new Date(supabaseUser.created_at);
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt timestamp");
  }

  const userMetadata = supabaseUser.user_metadata as Record<string, unknown> | undefined;

  const walker: Walker = {
    id: supabaseUser.id,
    email: supabaseUser.email,
    role: "walker" as const,
    firstName: userMetadata?.firstName as string | undefined,
    lastName: userMetadata?.lastName as string | undefined,
    phone: userMetadata?.phone as string | undefined,
    photoUrl: userMetadata?.photoUrl as string | undefined,
    createdAt: createdAtDate,
    onboardingStatus: "not_started" as const,
    setupStatus: "not_started" as const,
    bio: undefined,
    experience: undefined,
    dateOfBirth: undefined,
    verificationStatus: "pending" as const,
    availability: createEmptySchedule(),
    hourlyRate: undefined,
    rating: undefined,
    totalWalks: 0,
    bankInfo: undefined,
    verificationDocuments: undefined,
  };

  return walker;
};

/**
 * Maps Supabase user to app user based on role
 * @param supabaseUser - The Supabase user object
 * @param role - The user role
 * @returns A User object (Owner or Walker)
 * @throws Error if role is invalid or user data is invalid
 */
export const mapSupabaseUserToAppUser = (
  supabaseUser: unknown,
  role: unknown,
): User => {
  if (!isValidSupabaseUser(supabaseUser)) {
    throw new Error("Invalid Supabase user object");
  }

  if (typeof role !== "string") {
    throw new Error("Invalid user role: must be a string");
  }

  if (role === "owner") {
    return createOwner(supabaseUser);
  }

  if (role === "walker") {
    return createWalker(supabaseUser);
  }

  throw new Error(`Invalid user role: ${role}`);
};