"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// 헤더 컴포넌트
function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">Memorial</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/sign-in">
                <Button variant="link">로그인</Button>
              </Link>
            </li>
            <li>
              <Link href="/sign-up">
                <Button variant="link">회원가입</Button>
              </Link>
            </li>
            <li>
              <Link href="/anniversary">
                <Button variant="link">추모일</Button>
              </Link>
            </li>
            <li>
              <Link href="/article/write">
                <Button variant="link">추모글 작성</Button>
              </Link>
            </li>
            <li>
              <Link href="/article/list">
                <Button variant="link">추모글 보기</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

// Hero 섹션
function HeroSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          추억을 간직하고, 소중한 이들을 기억하세요
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          당신의 마음을 담은 추모일과 글을 작성하여 잊지 못할 기억을 보존하세요.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/sign-up">
            <Button size="lg">지금 시작하기</Button>
          </Link>
          <Link href="/article/list">
            <Button size="lg" variant="outline">
              추모글 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// 랜딩 페이지
export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <main className="container mx-auto py-12">
        <section className="py-8">
          <h2 className="text-2xl font-semibold mb-4">추모 기능 소개</h2>
          <p className="text-gray-700 mb-6">
            추모일을 관리하고, 추모 글을 작성하여 고인의 기억을 영원히 간직할 수
            있습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-bold">추모일 관리</h3>
              <p className="text-gray-600 mt-2">
                고인의 기념일을 잊지 않도록 관리하고, D-Day까지 남은 시간을
                확인하세요.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-lg font-bold">추모글 작성</h3>
              <p className="text-gray-600 mt-2">
                소중한 기억과 추억을 글로 남겨 고인을 기릴 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
