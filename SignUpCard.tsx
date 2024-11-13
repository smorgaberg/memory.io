"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/lib/signUp";
import { saveUserToFirestore } from "@/lib/firestore";
import { useRouter } from "next/navigation"; // next/navigation을 통해 페이지 이동

const SignUpCard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // useRouter 훅 사용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      toast({
        title: "비밀번호 불일치",
        description: "입력한 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const userCredential = await signUp(email, password);
      const { uid } = userCredential;
      await saveUserToFirestore(uid, name, email);

      toast({
        title: "회원가입 성공!",
        description: "계정이 성공적으로 생성되었습니다.",
        variant: "default",
      });

      router.push("/sign-in"); // 회원가입 성공 후 로그인 페이지로 이동
    } catch (err) {
      setError(err.message);
      toast({
        title: "회원가입 실패!",
        description: "문제가 발생했습니다. 다시 시도하세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          이름, 이메일과 비밀번호를 입력하여 가입하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full"
        />
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
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full" onClick={handleSubmit}>
          가입하기
        </Button>
      </CardFooter>
      <p className="text-sm text-center mt-1">
        이미 계정이 있나요?{" "}
        <a href="/sign-in" className="text-blue-600 hover:underline">
          로그인
        </a>
      </p>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </Card>
  );
};

export default SignUpCard;
