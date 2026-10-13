<script setup>
import { computed, defineComponent, h } from "vue";
import { parseMarkdown } from "../utils/parseMarkdown.js";

const props = defineProps({
  source: {
    type: String,
    default: "",
  },
});

function renderInline(parts) {
  if (!parts || !parts.length) return [];

  return parts.map((part, index) => {
    switch (part.type) {
      case "link":
        return h(
          "a",
          {
            key: index,
            href: part.url,
            target: "_blank",
            rel: "noopener noreferrer",
          },
          part.children?.length ? renderInline(part.children) : part.text
        );
      case "image":
        return h("img", {
          key: index,
          src: part.url,
          alt: part.alt || "",
          class: "markdown-image",
          loading: "lazy",
        });
      case "strong":
        return h("strong", { key: index }, renderInline(part.children));
      case "em":
        return h("em", { key: index }, renderInline(part.children));
      case "code":
        return h("code", { key: index, class: "markdown-inline-code" }, part.content);
      default:
        return h("span", { key: index }, part.content);
    }
  });
}

const ListItem = defineComponent({
  name: "ListItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    isOrdered: {
      type: Boolean,
      default: false,
    },
  },
  setup(itemProps) {
    return () => {
      const listTag = itemProps.isOrdered ? "ol" : "ul";
      const listClass = itemProps.isOrdered
        ? "markdown-list markdown-ol markdown-nested"
        : "markdown-list markdown-ul markdown-nested";

      const children =
        itemProps.item.children && itemProps.item.children.length > 0
          ? h(
              listTag,
              { class: listClass },
              itemProps.item.children.map((child, index) =>
                h(ListItem, {
                  key: index,
                  item: child,
                  isOrdered: itemProps.isOrdered,
                })
              )
            )
          : null;

      return h("li", { class: "markdown-list-item" }, [
        ...renderInline(itemProps.item.content),
        children,
      ]);
    };
  },
});

const BlockNodes = defineComponent({
  name: "BlockNodes",
  props: {
    blocks: {
      type: Array,
      required: true,
    },
  },
  setup(blockProps) {
    return () =>
      blockProps.blocks.map((block, index) => {
        if (block.type.startsWith("h")) {
          return h(
            block.type,
            { key: index, class: "markdown-heading" },
            renderInline(block.content)
          );
        }

        if (block.type === "p") {
          return h(
            "p",
            { key: index, class: "markdown-paragraph" },
            renderInline(block.content)
          );
        }

        if (block.type === "ul" || block.type === "ol") {
          return h(
            block.type,
            {
              key: index,
              class:
                block.type === "ul"
                  ? "markdown-list markdown-ul"
                  : "markdown-list markdown-ol",
            },
            block.items.map((item, itemIndex) =>
              h(ListItem, {
                key: itemIndex,
                item,
                isOrdered: block.type === "ol",
              })
            )
          );
        }

        if (block.type === "blockquote") {
          return h(
            "blockquote",
            { key: index, class: "markdown-blockquote" },
            h(BlockNodes, { blocks: block.children || [] })
          );
        }

        if (block.type === "code") {
          return h("pre", { key: index, class: "markdown-code-block" }, [
            h(
              "code",
              {
                class: block.lang
                  ? `language-${block.lang}`
                  : undefined,
              },
              block.content
            ),
          ]);
        }

        if (block.type === "hr") {
          return h("hr", { key: index, class: "markdown-hr" });
        }

        return null;
      });
  },
});

const parsedBlocks = computed(() => parseMarkdown(props.source));
</script>

<template>
  <div class="markdown-renderer">
    <BlockNodes :blocks="parsedBlocks" />
  </div>
</template>

<style>
/* Unscoped but namespaced: render tree is built with h() child components. */
.markdown-renderer {
  width: 100%;
}

.markdown-renderer .markdown-heading {
  margin-top: 1.75em;
  margin-bottom: 0.6em;
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.markdown-renderer h1.markdown-heading {
  font-size: 1.85em;
  border-bottom: 1px solid var(--border-color, #eaecef);
  padding-bottom: 0.3em;
}

.markdown-renderer h2.markdown-heading {
  font-size: 1.45em;
}

.markdown-renderer h3.markdown-heading {
  font-size: 1.2em;
}

.markdown-renderer h4.markdown-heading,
.markdown-renderer h5.markdown-heading,
.markdown-renderer h6.markdown-heading {
  font-size: 1.05em;
}

.markdown-renderer .markdown-paragraph {
  margin-bottom: 1.15em;
  line-height: 1.8;
  color: var(--text-secondary);
}

.markdown-renderer .markdown-list {
  margin-bottom: 1.15em;
  padding-left: 1.5em;
  color: var(--text-secondary);
}

.markdown-renderer .markdown-ul {
  list-style-type: disc;
}

.markdown-renderer .markdown-ol {
  list-style-type: decimal;
}

.markdown-renderer .markdown-nested {
  margin-top: 0.4em;
  margin-bottom: 0.4em;
}

.markdown-renderer .markdown-list-item {
  margin-bottom: 0.4em;
  line-height: 1.8;
  padding-left: 0.15em;
}

.markdown-renderer a {
  color: var(--accent-color, #0066cc);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
  text-decoration-color: rgba(var(--accent-color-rgb), 0.45);
  transition: text-decoration-color 0.2s ease, color 0.2s ease;
}

.markdown-renderer a:hover {
  text-decoration-color: var(--accent-color);
}

.markdown-renderer strong {
  font-weight: 700;
  color: var(--text-primary);
}

.markdown-renderer em {
  font-style: italic;
}

/* Ensure emphasis wins over inherited list/paragraph secondary color */
.markdown-renderer .markdown-list-item strong,
.markdown-renderer .markdown-paragraph strong {
  font-weight: 700;
  color: var(--text-primary);
}

.markdown-renderer .markdown-inline-code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;
  font-size: 0.9em;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.12em 0.4em;
  color: var(--text-primary);
}

.markdown-renderer .markdown-code-block {
  margin: 1.25em 0;
  padding: 1rem 1.1rem;
  overflow-x: auto;
  border-radius: 8px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  line-height: 1.55;
}

.markdown-renderer .markdown-code-block code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;
  font-size: 0.9em;
  color: var(--text-primary);
  background: transparent;
  border: none;
  padding: 0;
  white-space: pre;
}

.markdown-renderer .markdown-blockquote {
  margin: 1.25em 0;
  padding: 0.15em 0 0.15em 1em;
  border-left: 3px solid var(--accent-color);
  color: var(--text-secondary);
}

.markdown-renderer .markdown-blockquote .markdown-paragraph:last-child {
  margin-bottom: 0;
}

.markdown-renderer .markdown-hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2em 0;
}

.markdown-renderer .markdown-image {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1.25em 0;
  border-radius: 6px;
}
</style>
