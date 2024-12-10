"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/schemas/signInSchema";
import { signIn } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/userStore";

const SignInForm = () => {
  const router = useRouter();
  const { setUser, setLoading } = useUserStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormData) {
    setServerError(null);
    setLoading(true);
    const result = await signIn(data);

    if (result.error) {
      setLoading(false);
      if (typeof result.error === "object" && "message" in result.error) {
        setServerError(result.error.message as string);
        toast.error(
          <div className="inline-block">
            <div className="font-bold">{result.error.message}</div>
            <div className="text-sm">Please try again</div>
          </div>
        );
      } else {
        form.setError("root", {
          type: "manual",
          message: "An unexpected error occurred",
        });
        toast.error(
          <div className="inline-block">
            <div className="font-bold">An unexpected error occurred</div>
            <div className="text-sm">Please try again</div>
          </div>
        );
      }
    } else {
      console.log("success signin: ", result.data.user);

      setUser(result.data?.user);
      toast.success(
        <div className="inline-block">
          <div className="font-bold">Login Successful</div>
          <div className="text-sm">You will be redirected shortly</div>
        </div>
      );

      setTimeout(() => {
        router.refresh();
        router.push("/");
      }, 1000);
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} className="rounded-lg" />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl className="relative">
                <div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <>{showPassword ? <EyeOff /> : <Eye />}</>
                  </button>
                </div>
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
        <Button
          type="submit"
          disabled={
            form.formState.isSubmitting || useUserStore.getState().isLoading
          }
          className="w-full"
        >
          {form.formState.isSubmitting || useUserStore.getState().isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
