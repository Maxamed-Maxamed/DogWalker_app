/**
 * User factory utilities for creating typed user objects
 */

import type { Owner, User, Walker, WeeklySchedule } from "../types";

interface SupabaseUserData {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    photoUrl?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

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
 * Creates a new Owner user from Supabase user data
 * @param supabaseUser - The Supabase user object
 * @returns A new Owner object
 * @throws Error if required fields are missing
 */
export const createOwner = (supabaseUser: unknown): Owner => {
  const u = supabaseUser as SupabaseUserData | null | undefined;
  if (!u?.id || !u?.email) {
    throw new Error("Invalid Supabase user object: missing id or email");
  }

  const createdAtDate = new Date(u.created_at);
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt timestamp");
  }

  const owner: Owner = {
    id: u.id,
    email: u.email,
    role: "owner" as const,
    firstName: u.user_metadata?.firstName,
    lastName: u.user_metadata?.lastName,
    phone: u.user_metadata?.phone,
    photoUrl: u.user_metadata?.photoUrl,
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
  const u = supabaseUser as SupabaseUserData | null | undefined;
  if (!u?.id || !u?.email) {
    throw new Error("Invalid Supabase user object: missing id or email");
  }

  const createdAtDate = new Date(u.created_at);
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error("Invalid createdAt timestamp");
  }

  const walker: Walker = {
    id: u.id,
    email: u.email,
    role: "walker" as const,
    firstName: u.user_metadata?.firstName,
    lastName: u.user_metadata?.lastName,
    phone: u.user_metadata?.phone,
    photoUrl: u.user_metadata?.photoUrl,
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
  role: string,
): User => {
  const u = supabaseUser as SupabaseUserData | null | undefined;
  if (!u?.id || !u?.email) {
    throw new Error("Invalid Supabase user object");
  }

  if (role === "owner") {
    return createOwner(supabaseUser);
  }

  if (role === "walker") {
    return createWalker(supabaseUser);
  }

  throw new Error(`Invalid user role: ${role}`);
};
