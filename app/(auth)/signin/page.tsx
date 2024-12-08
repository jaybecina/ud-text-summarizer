import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "@/components/auth/SignInForm";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="h-16 w-16 mb-4">
            <Image
              src={IMAGES.UD_LOGO}
              alt="Undetectable AI Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl text-center">
            Log in to Undetectable AI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to continue
          </p>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
