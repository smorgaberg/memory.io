"use client";

import { Input } from "@/components/ui/input"; // Shadcn UI Input
import { db, storage } from "@/lib/firebaseConfig"; // Firebase 연결
import { getAuth } from "firebase/auth"; // Firebase Auth
import { addDoc, collection } from "firebase/firestore"; // Firestore
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage"; // Firebase Storage
import dynamic from "next/dynamic";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid"; // Unique ID 생성기

// QuillWrapper를 동적으로 임포트
const ReactQuill = dynamic(() => import("./QuillWrapper"), { ssr: false });

export default function RichTextEditor() {
  const [title, setTitle] = useState(""); // Title 입력 필드
  const [content, setContent] = useState(""); // Quill 에디터 내용
  const [isSaving, setIsSaving] = useState(false); // 저장 상태
  const quillRef = useRef<ReactQuill | null>(null); // Quill 에디터 참조
  const [error, setError] = useState<string | null>(null); // 오류 상태 관리

  // Firebase Auth에서 UID 가져오기
  const auth = getAuth();
  const user = auth.currentUser;

  // 파일 업로드 처리 (공통 핸들러)
  const handleFileUpload = useCallback(async (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const storageReference = storageRef(storage, `${type}s/${uuidv4()}`); // Firebase Storage에 파일 경로 설정

      try {
        // 파일 업로드
        await uploadBytes(storageReference, file);

        const downloadURL = await getDownloadURL(storageReference);

        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection();
          if (range) {
            editor.insertEmbed(range.index, type, downloadURL);
          } else {
            editor.insertEmbed(0, type, downloadURL); // 기본 위치
          }
        }
      } catch (err) {
        setError(`${type} 업로드 실패: 네트워크 오류 또는 파일 문제.`);
      }
    };
    input.click();
  }, []);

  // Quill toolbar 설정
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike"],
          ["image", "video", "link"],
        ],
        handlers: {
          image: () => handleFileUpload("image"),
          video: () => handleFileUpload("video"),
        },
      },
    }),
    [handleFileUpload]
  );

  // Firestore에 문서 저장, UID와 제목 추가
  const saveDocument = async () => {
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, "documents"), {
        title, // 제목 추가
        content,
        uid: user.uid, // UID 저장
      });
      console.log("Document ID: ", docRef.id); // 자동 생성된 documentID 확인
      setError(null);
    } catch (err) {
      setError("문서 저장 중 오류 발생.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <Input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <ReactQuill
        theme="snow"
        forwardedRef={quillRef}
        onChange={setContent}
        value={content}
        modules={modules}
      />
      <button
        onClick={saveDocument}
        disabled={isSaving}
        className={`mt-4 ${
          isSaving ? "bg-gray-400" : "bg-blue-500"
        } text-white px-4 py-2 rounded`}
      >
        {isSaving ? "저장 중..." : "문서 저장"}
      </button>
    </div>
  );
}
