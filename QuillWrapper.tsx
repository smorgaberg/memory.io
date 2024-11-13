import dynamic from "next/dynamic";
import { useRef, LegacyRef } from "react";
import type ReactQuill from "react-quill";

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      return <RQ ref={forwardedRef} {...props} />;
    }

    return QuillJS;
  },
  {
    ssr: false,
  }
);

export default ReactQuillBase;

// export function Editor() {
//   const quillRef = useRef<ReactQuill>(null);

//   console.log(quillRef.current?.getEditor());

//   return (
//     <>
//       <div>
//         <ReactQuillBase forwardedRef={quillRef} />
//       </div>
//     </>
//   );
// }
