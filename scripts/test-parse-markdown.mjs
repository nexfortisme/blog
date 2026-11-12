import {
  parseMarkdown,
  parseInline,
  stripFrontmatter,
  stripLeadingTitleHeading,
} from "../src/utils/parseMarkdown.js";

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exitCode = 1;
  } else {
    console.log("ok:", message);
  }
}

const boldParts = parseInline("tools **are here**, yes");
assert(
  boldParts.some((p) => p.type === "strong"),
  "parses **bold**"
);

const codeParts = parseInline("settled on `qwen/qwen3.5-9b` for Bart");
assert(
  codeParts.some((p) => p.type === "code" && p.content === "qwen/qwen3.5-9b"),
  "parses inline code"
);

const linkParts = parseInline(
  "rewrite [Bot Person](https://github.com/nexfortisme/bot-person) but"
);
assert(
  linkParts.some(
    (p) => p.type === "link" && p.url.includes("bot-person")
  ),
  "parses links"
);

const blocks = parseMarkdown(`# Title

Paragraph with **bold** and \`code\`.

- item
  - nested

1. first
2. second

> a quote

\`\`\`js
const x = 1;
\`\`\`

---

![alt](https://example.com/a.png)
`);

assert(blocks.some((b) => b.type === "h1"), "heading");
assert(blocks.some((b) => b.type === "ul"), "ul");
assert(blocks.some((b) => b.type === "ol"), "ol");
assert(blocks.some((b) => b.type === "blockquote"), "blockquote");
assert(blocks.some((b) => b.type === "code" && b.lang === "js"), "fenced code");
assert(blocks.some((b) => b.type === "hr"), "hr");
assert(
  blocks.some(
    (b) =>
      b.type === "p" &&
      b.content.some((p) => p.type === "image")
  ),
  "image in paragraph"
);

const fm = stripFrontmatter(`----
title: Going Live
----

# Going Live
Body`);
assert(fm.startsWith("# Going Live"), "strips ---- frontmatter");

const deduped = stripLeadingTitleHeading(fm, "Going Live");
assert(deduped === "Body", "strips duplicate leading title h1");

// Nested list from real post shape
const nested = parseMarkdown(`- parent
  - child
  - child2
- next`);
assert(nested[0]?.type === "ul", "nested list block");
assert(nested[0].items[0].children.length === 2, "nested children attached");

if (!process.exitCode) {
  console.log("\nAll parseMarkdown checks passed.");
}
