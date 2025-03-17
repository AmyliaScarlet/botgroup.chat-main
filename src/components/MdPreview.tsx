import ReactMarkdown from "react-markdown"; // 解析 markdown
import remarkGfm from "remark-gfm"; // markdown 对表格/删除线/脚注等的支持
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGemoji from "remark-gemoji";
import rehypeRaw from "rehype-raw";

import { ReactSVG } from 'react-svg';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 代码高亮主题风格
import { darcula, oneDark, prism, vs } from "react-syntax-highlighter/dist/esm/styles/prism"; 
import "@/styles/MdPreview.less";
import { useState } from "react";
import ClipboardUtil from "@/lib/ClipboardUtil";

// Change enum to type
export type ThemeEnum = typeof prism | typeof oneDark | typeof darcula | typeof vs;

// Add theme constants
export const Themes = {
  DEFAULT: prism,
  ONEDARK: oneDark,
  DARCULA: darcula,
  VS: vs
} as const;

interface Props {
  content: string;
  theme?: ThemeEnum;
  deepThink?: boolean;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  sender?: string;
  isLast?: boolean;
}

const inlineCodeStyle = {
  background: "rgba(243, 244, 244)",
  padding: "2px 5px",
  fontSize: "15px",
  color: "rgba(51, 51, 51)",
};

const splitString = (input:string) => {
  const thinkStart = input.indexOf('<think>');
  const thinkEnd = input.indexOf('</think>');
  if (thinkStart!== -1 && thinkEnd!== -1) {
    const thinkContent = input.slice(thinkStart + 7, thinkEnd);
    const restContent = input.slice(0, thinkStart) + input.slice(thinkEnd + 8);
    return [thinkContent, restContent];
  } else {
    if(thinkStart!== -1){
      const thinkContent = input.slice(thinkStart + 7);
      const restContent = '';
      return [thinkContent, restContent];
    }else{
      return ['', input];
    }
  }

}

const MdPreview: React.FC<Props> = ({ sender,content, theme,isLast, className='' , deepThink = false} , inline = true) => {

  const [thinkContent, restContent] = splitString(content);

  let index = 0;
  return (
    <>
      <div className={(deepThink && sender != "我" && isLast) ? "md-think" : "hidden"}>{thinkContent}</div>
      <ReactMarkdown
        className={className}
        remarkPlugins={[remarkGfm, remarkMath, remarkGemoji]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          // pre(props) {
          //   const { children,className } = props;
          //   return <div className="md-pre">{children}</div>;
          // },
          code(props: Props) {
            const { children, className, inline } = props;
            // 匹配否指定语言
            const match: any = /language-(\w+)/.exec(className || "");
            let language = match && match[1];
            if(language == ""){
              language = "txt";
            }
            let [isShowCode, setIsShowCode] = useState(true);
            let [isShowCopy, setIsShowCopy] = useState(false);
            return (
              <>
                {!inline ? (
                  <>
                    {/* 代码头部 */}
                    <div className="code-header">
                      <div
                        style={{ cursor: "pointer", marginRight: "10px", transformOrigin: "8px" }}
                        className={isShowCode ? "code-rotate-down" : "code-rotate-right"}
                        onClick={() => setIsShowCode(!isShowCode)}
                      >
                        <ReactSVG src="/src/assets/download.svg" />
                      </div>
                      <div>{language}</div>
                      <div
                        className="preview-code-copy"
                        onClick={() => {
                          setIsShowCopy(true);
                          ClipboardUtil.writeText(String(children));
                          setTimeout(() => {
                            setIsShowCopy(false);
                          }, 1500);
                        }}
                      >
                        {isShowCopy && <span className=" copy-success">复制成功</span>}
                        <ReactSVG src="/src/assets/copy.svg" />
                      </div>
                    </div>
                    {isShowCode && (
                      <SyntaxHighlighter
                        showLineNumbers={true}
                        style={theme}
                        language={match && match[1]}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    )}
                  </>
                ) : (
                  <code className={className} style={inlineCodeStyle}>
                    {children}
                  </code>
                )}
              </>
            );
          },
          h1({ children }) {
            return (
              <h1 id={"heading-" + ++index} className="heading">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 id={"heading-" + ++index} className="heading">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 id={"heading-" + ++index} className="heading">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 id={"heading-" + ++index} className="heading">
                {children}
              </h4>
            );
          },
          h5({ children }) {
            return (
              <h5 id={"heading-" + ++index} className="heading">
                {children}
              </h5>
            );
          },
          h6({ children }) {
            return (
              <h6 id={"heading-" + ++index} className="heading">
                {children}
              </h6>
            );
          },
        }}
      >
        {restContent}
      </ReactMarkdown>
    </>
  );
};

export default MdPreview;
