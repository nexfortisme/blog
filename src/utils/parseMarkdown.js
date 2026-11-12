/**
 * Lightweight markdown parser for article bodies.
 * Supports headings, paragraphs, lists (nested), blockquotes, fenced code,
 * horizontal rules, links, images, bold, italic, and inline code.
 */

function parseInline(text) {
  if (!text) return [];

  const parts = [];
  let i = 0;

  const pushText = (value) => {
    if (!value) return;
    const last = parts[parts.length - 1];
    if (last && last.type === "text") {
      last.content += value;
    } else {
      parts.push({ type: "text", content: value });
    }
  };

  while (i < text.length) {
    // Inline code: `code`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        parts.push({ type: "code", content: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // Images: ![alt](url) — check before links
    if (text[i] === "!" && text[i + 1] === "[") {
      const imgMatch = text.slice(i).match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
      if (imgMatch) {
        parts.push({ type: "image", alt: imgMatch[1], url: imgMatch[2] });
        i += imgMatch[0].length;
        continue;
      }
    }

    // Links: [text](url)
    if (text[i] === "[") {
      const linkMatch = text.slice(i).match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
      if (linkMatch) {
        parts.push({
          type: "link",
          text: linkMatch[1],
          url: linkMatch[2],
          children: parseInline(linkMatch[1]),
        });
        i += linkMatch[0].length;
        continue;
      }
    }

    // Bold: **text** or __text__
    if (
      (text[i] === "*" && text[i + 1] === "*") ||
      (text[i] === "_" && text[i + 1] === "_")
    ) {
      const marker = text.slice(i, i + 2);
      const end = text.indexOf(marker, i + 2);
      if (end !== -1) {
        const inner = text.slice(i + 2, end);
        parts.push({ type: "strong", children: parseInline(inner) });
        i = end + 2;
        continue;
      }
    }

    // Italic: *text* or _text_
    if (text[i] === "*" || text[i] === "_") {
      const marker = text[i];
      // Avoid matching list-like leftovers; require closing marker
      const end = text.indexOf(marker, i + 1);
      if (end !== -1 && end > i + 1) {
        const inner = text.slice(i + 1, end);
        // Underscore italic: prefer word-boundary-ish matches to reduce false positives
        if (marker === "_" && /[a-zA-Z0-9]/.test(text[i - 1] || "") && /[a-zA-Z0-9]/.test(text[end + 1] || "")) {
          pushText(text[i]);
          i += 1;
          continue;
        }
        parts.push({ type: "em", children: parseInline(inner) });
        i = end + 1;
        continue;
      }
    }

    pushText(text[i]);
    i += 1;
  }

  return parts.length ? parts : [{ type: "text", content: text }];
}

function getIndentLevel(spaces) {
  return Math.floor(spaces.length / 2);
}

function attachListItem(listItems, item) {
  if (item.level === 0) {
    listItems.push(item);
    return;
  }

  let parent = listItems[listItems.length - 1];
  if (!parent) {
    listItems.push({ ...item, level: 0 });
    return;
  }

  for (let l = 1; l < item.level; l++) {
    if (parent.children.length > 0) {
      parent = parent.children[parent.children.length - 1];
    } else {
      break;
    }
  }
  parent.children.push(item);
}

function parseList(lines, startIndex, ordered) {
  const listItems = [];
  let i = startIndex;
  let lastLevel = 0;
  const itemRe = ordered
    ? /^(\s*)(\d+)\.\s+(.+)$/
    : /^(\s*)([-*+])\s+(.+)$/;

  while (i < lines.length) {
    const currentLine = lines[i];
    const match = currentLine.match(itemRe);

    if (match) {
      const level = getIndentLevel(match[1]);

      if (level === 0 && listItems.length > 0 && lastLevel > 0) {
        break;
      }

      const item = {
        level,
        content: parseInline(match[3]),
        children: [],
      };
      attachListItem(listItems, item);
      lastLevel = level;
      i += 1;
      continue;
    }

    if (currentLine.trim() === "") {
      // Blank line ends the list if the next non-empty line is not a list item
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j += 1;
      if (j >= lines.length || !lines[j].match(itemRe)) {
        break;
      }
      i += 1;
      continue;
    }

    break;
  }

  return {
    block:
      listItems.length > 0
        ? { type: ordered ? "ol" : "ul", items: listItems }
        : null,
    nextIndex: i,
  };
}

export function parseMarkdown(markdown) {
  if (!markdown) return [];

  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Fenced code blocks
    const fenceMatch = line.match(/^(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const fence = fenceMatch[1];
      const lang = (fenceMatch[2] || "").trim();
      const codeLines = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith(fence[0].repeat(fence.length))) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // closing fence
      blocks.push({ type: "code", lang, content: codeLines.join("\n") });
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 6);
      blocks.push({
        type: `h${level}`,
        content: parseInline(headingMatch[2].replace(/\s+#+\s*$/, "")),
      });
      i += 1;
      continue;
    }

    // Blockquotes (contiguous > lines)
    if (/^>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      // Recursively parse quote body as markdown blocks
      const inner = parseMarkdown(quoteLines.join("\n"));
      blocks.push({ type: "blockquote", children: inner });
      continue;
    }

    // Bulleted lists
    if (/^[\s]*[-*+]\s+/.test(line)) {
      const { block, nextIndex } = parseList(lines, i, false);
      if (block) blocks.push(block);
      i = nextIndex;
      continue;
    }

    // Numbered lists
    if (/^[\s]*\d+\.\s+/.test(line)) {
      const { block, nextIndex } = parseList(lines, i, true);
      if (block) blocks.push(block);
      i = nextIndex;
      continue;
    }

    // Paragraph
    const paragraphLines = [];
    while (i < lines.length) {
      const currentLine = lines[i];
      if (!currentLine.trim()) break;
      if (
        /^(#{1,6})\s+/.test(currentLine) ||
        /^[\s]*[-*+]\s+/.test(currentLine) ||
        /^[\s]*\d+\.\s+/.test(currentLine) ||
        /^>\s?/.test(currentLine) ||
        /^(`{3,}|~{3,})/.test(currentLine) ||
        /^(-{3,}|\*{3,}|_{3,})\s*$/.test(currentLine.trim())
      ) {
        break;
      }
      paragraphLines.push(currentLine.trimEnd());
      i += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: "p",
        content: parseInline(paragraphLines.join(" ")),
      });
    }
  }

  return blocks;
}

export function stripFrontmatter(markdown) {
  if (!markdown) return "";
  // Content repo uses ---- delimiters (not standard --- YAML)
  const fourDash = /^----\s*\n[\s\S]*?\n----\s*\n?/;
  const threeDash = /^---\s*\n[\s\S]*?\n---\s*\n?/;
  return markdown.replace(fourDash, "").replace(threeDash, "").trim();
}

export function stripLeadingTitleHeading(markdown, title) {
  if (!markdown || !title) return markdown || "";
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markdown
    .replace(new RegExp(`^#\\s+${escaped}\\s*\\n+`, "i"), "")
    .trim();
}

export { parseInline };
