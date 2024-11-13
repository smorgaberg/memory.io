"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13 이상에서 사용
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Firestore import
import { Card } from "@/components/ui/card"; // Shadcn UI Card 컴포넌트
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Shadcn UI Dialog 컴포넌트
import { Button } from "@/components/ui/button"; // Shadcn UI Button 컴포넌트

export default function DocumentList() {
  const [documents, setDocuments] = useState([]); // Firestore 문서 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const router = useRouter(); // Next.js 라우터 사용

  // Firestore에서 documents 컬렉션 가져오기
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "documents"));
        const docsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(docsArray); // 문서 상태 업데이트
      } catch (error) {
        console.error("문서 가져오기 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchDocuments();
  }, []);

  // 문서 삭제 함수
  const deleteDocument = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "documents", docId));
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== docId)
      ); // 상태에서 문서 제거
    } catch (error) {
      console.error("문서 삭제 중 오류 발생:", error);
    }
  };

  // 수정 페이지로 이동 함수
  const goToEditPage = (docId: string) => {
    router.push(`/edit/${docId}`); // 문서 ID와 함께 수정 페이지로 이동
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">추모 글 목록</h1>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="p-6 shadow-md">
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            {/* HTML 형태의 content를 안전하게 렌더링 */}
            <div
              className="html-content"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            ></div>
            <p className="text-sm text-gray-500">작성자: {doc.uid}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-2">수정/삭제</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>문서 수정/삭제</DialogTitle>
                  <DialogDescription>
                    문서를 수정하거나 삭제할 수 있습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    onClick={() => goToEditPage(doc.id)}
                    variant="default"
                  >
                    수정
                  </Button>
                  <Button
                    onClick={() => deleteDocument(doc.id)}
                    variant="destructive"
                  >
                    삭제
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>
    </div>
  );
}
