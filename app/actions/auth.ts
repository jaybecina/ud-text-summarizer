"use server";

import { signInSchema, type SignInFormData } from "@/schemas/signInSchema";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const prisma = new PrismaClient();
const supabase = createClient(supabaseUrl, supabaseKey);

export async function signIn(formData: SignInFormData) {
  const result = signInSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.format() };
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error("Invalid email or password.");
      return { error: { message: "Invalid email or password" } };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.error("Invalid email or password.");
      return { error: { message: "Invalid email or password" } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase signin error: ", error.message);
      return { error: { message: error.message } };
    }

    cookies().set("auth-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error("Error: ", error);
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Check your email to confirm your account" };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  cookies().delete("session");
  return { success: true };
}
