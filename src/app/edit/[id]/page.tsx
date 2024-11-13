"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig"; // Firebase 연결
import { doc, getDoc, updateDoc } from "firebase/firestore";
import dynamic from "next/dynamic"; // Quill 에디터 동적 import
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams(); // Replaces query from useRouter
  const docId = params.id; // Retrieve the document ID from the query parameters
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Firestore에서 문서 가져오기
  useEffect(() => {
    const fetchDocument = async () => {
      if (!docId) return;

      const docRef = doc(db, "documents", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        setTitle(docData.title);
        setContent(docData.content);
      } else {
        console.error("문서가 존재하지 않습니다.");
      }

      setLoading(false);
    };

    fetchDocument();
  }, [docId]);

  // 문서 수정 함수
  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "documents", docId);
      await updateDoc(docRef, {
        title,
        content,
      });
      router.push("/article/list"); // 수정 완료 후 리스트 페이지로 돌아가기
    } catch (error) {
      console.error("문서 수정 중 오류 발생:", error);
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">문서 수정</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full p-2 mb-4 border rounded"
      />
      <ReactQuill value={content} onChange={setContent} />
      <Button onClick={handleUpdate} className="mt-4">
        수정 완료
      </Button>
    </div>
  );
}
