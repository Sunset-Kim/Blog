import React, { createRef, useEffect, useMemo } from "react";
import { REPO_NAME } from "../../constants";

interface P {
  pathName: string;
}

export default function Comments({ pathName }: P) {
  const commentRef = createRef<HTMLDivElement>();

  const config = useMemo(
    () => ({
      src: "https://utteranc.es/client.js",
      repo: REPO_NAME,
      "issue-term": pathName,
      label: "comment",
      theme: "github-light",
      crossorigin: "anonymous",
      async: "true",
    }),
    []
  );

  useEffect(() => {
    if (!commentRef.current) return;

    const utterances = document.createElement("script");
    Object.entries(config).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });
    commentRef.current.appendChild(utterances);
  }, []);

  return <div ref={commentRef} />;
}
