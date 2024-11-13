"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignInCard = () => {
  const router = useRouter();

  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: "로그인 성공!",
        description: "성공적으로 로그인되었습니다.",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (err) {
      let errorMessage = "";

      switch (err.code) {
        case "auth/user-not-found":
          errorMessage = "존재하지 않는 사용자입니다.";
          break;
        case "auth/wrong-password":
          errorMessage = "잘못된 비밀번호입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 형식입니다.";
          break;
        default:
          errorMessage = "로그인 중 문제가 발생했습니다. 다시 시도하세요.";
      }

      setError(errorMessage);
      toast({
        title: "로그인 실패!",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>
          이메일과 비밀번호를 입력하여 로그인하세요.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </CardFooter>
        <p className="text-sm text-center mt-1">
          계정이 없나요?{" "}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            회원가입
          </a>
        </p>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </form>
    </Card>
  );
};

export default SignInCard;
