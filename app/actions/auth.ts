"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signInSchema, type SignInFormData } from "@/schemas/signInSchema";
import { signUpSchema, type SignUpFormData } from "@/schemas/signUpSchema";
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
  const result = signUpSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return { error: result.error.format() };
  }

  const { first_name, last_name, email, password } = result.data;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    await createPrismaUser(first_name, last_name, email, password);

    return {
      success: true,
      message: "Check your email to confirm your account",
    };
  } catch (error) {
    console.error("Error: ", error);
    return { error: { message: "An unexpected error occurred during signup" } };
  }
}

async function createPrismaUser(
  first_name: string,
  last_name: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    },
  });
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  cookies().delete("session");
  cookies().delete("auth-token");

  revalidatePath("/", "layout");
  redirect("/signin");
  return { success: true };
}
