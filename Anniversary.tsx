"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale"; // 한국어 로케일 임포트
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Shadcn Calendar component
import { Calendar as CalendarIcon } from "lucide-react"; // Icon for Calendar button
import Toast from "@/components/ui/toast"; // Shadcn toast component

export default function MemorialPage() {
  const [description, setDescription] = useState(""); // 추모일 설명 입력 상태
  const [date, setDate] = useState<Date | null>(null); // 선택된 날짜 상태
  const [memorials, setMemorials] = useState([]); // Firestore에서 불러온 추모일 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태 관리

  // Firestore에서 추모일 데이터 가져오기
  useEffect(() => {
    const fetchMemorials = async () => {
      const querySnapshot = await getDocs(collection(db, "memorials"));
      const memorialArray = querySnapshot.docs.map((doc) => ({
        id: doc.id, // key로 사용할 고유 ID
        ...doc.data(),
      }));
      setMemorials(memorialArray);
      setLoading(false);
    };

    fetchMemorials();
  }, []);

  // 추모일 추가 함수
  const handleAddMemorial = async () => {
    if (!description || !date) {
      toast({
        title: "추모일 추가 실패",
        description: "설명과 날짜를 입력해 주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newMemorial = {
        description,
        date: format(date, "yyyy-MM-dd", { locale: ko }), // 날짜 포맷 지정 및 한국어 설정
      };

      await addDoc(collection(db, "memorials"), newMemorial);
      setMemorials((prev) => [
        ...prev,
        { ...newMemorial, id: new Date().toISOString() },
      ]); // 새로운 추모일 추가 및 key 부여
      setDescription("");
      setDate(null);

      // 성공 피드백
      toast({
        title: "추모일 추가 성공",
        description: "추모일이 성공적으로 추가되었습니다.",
      });
    } catch (error) {
      // 실패 피드백
      toast({
        title: "추모일 추가 실패",
        description: "추모일 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("추모일 추가 중 오류 발생:", error);
    }
  };

  // D-Day 계산 함수
  const calculateDDay = (memorialDate: string) => {
    const today = new Date();
    const diff = differenceInDays(new Date(memorialDate), today);
    if (diff === 0) return "D-Day";
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">추모일 추가</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="추모일 설명"
          className="mb-4"
        />

        {/* Popover to display Calendar */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: ko })
              ) : (
                <span>날짜를 선택하세요</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={ko} // Calendar에서 한국어 적용
            />
          </PopoverContent>
        </Popover>

        <Button onClick={handleAddMemorial} className="mt-4">
          추모일 추가
        </Button>
      </div>

      <h2 className="text-lg font-semibold mb-4">추모일 목록</h2>
      <div className="grid gap-4">
        {memorials.map((memorial) => {
          const isDDay = calculateDDay(memorial.date) === "D-Day";
          return (
            <Card
              key={memorial.id}
              className={`p-6 shadow-md rounded-lg transition-transform duration-200 ${
                isDDay ? "border-2 border-red-500 bg-red-50" : "border"
              }`}
            >
              <h3 className="text-md font-semibold">{memorial.description}</h3>
              <p className="text-sm text-gray-500">{`날짜: ${memorial.date}`}</p>
              <p
                className={`text-lg font-bold mt-2 ${
                  isDDay ? "text-red-600" : "text-gray-700"
                }`}
              >
                {`D-Day: ${calculateDDay(memorial.date)}`}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
