import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

function Animate() {
  const code = `
  bool accepted = false;
  int attempts = 0;
  while (!accepted) {
      think();
      code();
      debug();
      test();
      attempts++;
      accepted = submit();
  }
  cout << "Accepted" << endl;
  cout << "Attempts: " << attempts << endl;
  cout << "Welcome to CodeClash" << endl;`;

  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function startTyping() {
      while (!cancelled) {
        for (let i = 0; i <= code.length; i++) {
          const partial = code.slice(0, i);

          const highlighted = await codeToHtml(partial, {
            lang: "cpp",
            theme: "github-dark",
            transformers: [
              {
                pre(node) {
                  node.properties.style = "background:#212328";
                },
              },
            ],
          });

          if (cancelled) return;

          setHtml(highlighted);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setHtml("");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    startTyping();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="hidden lg:block w-[480px] rounded-2xl h-85 border border-white/10 bg-[#212328] shadow-2xl overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}

export default Animate;
