<script setup>
import { computed, defineComponent, h } from 'vue';

const props = defineProps({
  source: {
    type: String,
    default: ''
  }
});

// Simple markdown parser that handles:
// - Headings (h1-h4)
// - Links
// - Bulleted lists
// - Numbered lists
// - Nested lists

function parseMarkdown(markdown) {
  if (!markdown) return [];
  
  const lines = markdown.split('\n');
  const blocks = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }
    
    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      blocks.push({ type: `h${level}`, content: parseInline(text) });
      i++;
      continue;
    }
    
    // Bulleted lists
    if (line.match(/^[\s]*[-*+]\s+/)) {
      const listItems = [];
      let indentLevel = 0;
      
      while (i < lines.length) {
        const currentLine = lines[i];
        const bulletMatch = currentLine.match(/^(\s*)([-*+])\s+(.+)$/);
        
        if (bulletMatch) {
          const currentIndent = bulletMatch[1].length;
          const content = bulletMatch[3];
          
          // Determine nesting level (every 2 spaces = 1 level)
          const level = Math.floor(currentIndent / 2);
          
          if (level === 0 && listItems.length > 0 && indentLevel > 0) {
            // We've gone back to top level, break
            break;
          }
          
          const item = {
            level,
            content: parseInline(content),
            children: []
          };
          
          if (level === 0) {
            listItems.push(item);
            indentLevel = 0;
          } else {
            // Find parent at level - 1
            let parent = listItems[listItems.length - 1];
            for (let l = 1; l < level; l++) {
              if (parent.children.length > 0) {
                parent = parent.children[parent.children.length - 1];
              } else {
                break;
              }
            }
            parent.children.push(item);
          }
          
          indentLevel = level;
          i++;
        } else if (currentLine.trim() === '') {
          i++;
          continue;
        } else {
          break;
        }
      }
      
      if (listItems.length > 0) {
        blocks.push({ type: 'ul', items: listItems });
      }
      continue;
    }
    
    // Numbered lists
    if (line.match(/^[\s]*\d+\.\s+/)) {
      const listItems = [];
      let indentLevel = 0;
      
      while (i < lines.length) {
        const currentLine = lines[i];
        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.+)$/);
        
        if (numberedMatch) {
          const currentIndent = numberedMatch[1].length;
          const content = numberedMatch[3];
          
          // Determine nesting level (every 2 spaces = 1 level)
          const level = Math.floor(currentIndent / 2);
          
          if (level === 0 && listItems.length > 0 && indentLevel > 0) {
            // We've gone back to top level, break
            break;
          }
          
          const item = {
            level,
            content: parseInline(content),
            children: []
          };
          
          if (level === 0) {
            listItems.push(item);
            indentLevel = 0;
          } else {
            // Find parent at level - 1
            let parent = listItems[listItems.length - 1];
            for (let l = 1; l < level; l++) {
              if (parent.children.length > 0) {
                parent = parent.children[parent.children.length - 1];
              } else {
                break;
              }
            }
            parent.children.push(item);
          }
          
          indentLevel = level;
          i++;
        } else if (currentLine.trim() === '') {
          i++;
          continue;
        } else {
          break;
        }
      }
      
      if (listItems.length > 0) {
        blocks.push({ type: 'ol', items: listItems });
      }
      continue;
    }
    
    // Regular paragraph
    const paragraphLines = [];
    while (i < lines.length) {
      const currentLine = lines[i];
      if (!currentLine.trim()) {
        break;
      }
      // Don't start a paragraph if it's a heading or list
      if (currentLine.match(/^(#{1,4})\s+/) || 
          currentLine.match(/^[\s]*[-*+]\s+/) || 
          currentLine.match(/^[\s]*\d+\.\s+/)) {
        break;
      }
      paragraphLines.push(currentLine);
      i++;
    }
    
    if (paragraphLines.length > 0) {
      blocks.push({ 
        type: 'p', 
        content: parseInline(paragraphLines.join(' ')) 
      });
    }
  }
  
  return blocks;
}

// Parse inline elements (links, bold, italic, etc.)
function parseInline(text) {
  const parts = [];
  let currentIndex = 0;
  
  // Match links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > currentIndex) {
      const beforeText = text.substring(currentIndex, match.index);
      if (beforeText) {
        parts.push({ type: 'text', content: beforeText });
      }
    }
    
    // Add the link
    parts.push({
      type: 'link',
      text: match[1],
      url: match[2]
    });
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    const remainingText = text.substring(currentIndex);
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText });
    }
  }
  
  // If no links were found, return the whole text as a single part
  if (parts.length === 0) {
    parts.push({ type: 'text', content: text });
  }
  
  return parts;
}

// Recursive list item component
const ListItem = defineComponent({
  name: 'ListItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isOrdered: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return () => {
      const listTag = props.isOrdered ? 'ol' : 'ul';
      const listClass = props.isOrdered 
        ? 'markdown-list markdown-ol markdown-nested' 
        : 'markdown-list markdown-ul markdown-nested';
      
      const children = props.item.children && props.item.children.length > 0
        ? h(listTag, { class: listClass }, 
            props.item.children.map((child, index) => 
              h(ListItem, { key: index, item: child, isOrdered: props.isOrdered })
            )
          )
        : null;
      
      return h('li', { class: 'markdown-list-item' }, [
        ...props.item.content.map((part, index) => 
          part.type === 'link'
            ? h('a', { 
                href: part.url, 
                target: '_blank', 
                rel: 'noopener noreferrer' 
              }, part.text)
            : h('span', part.content)
        ),
        children
      ]);
    };
  }
});

const parsedBlocks = computed(() => parseMarkdown(props.source));
</script>

<template>
  <div class="markdown-renderer">
    <template v-for="(block, index) in parsedBlocks" :key="index">
      <!-- Headings -->
      <component 
        v-if="block.type.startsWith('h')" 
        :is="block.type"
        class="markdown-heading"
      >
        <template v-for="(part, partIndex) in block.content" :key="partIndex">
          <a v-if="part.type === 'link'" :href="part.url" target="_blank" rel="noopener noreferrer">
            {{ part.text }}
          </a>
          <span v-else>{{ part.content }}</span>
        </template>
      </component>
      
      <!-- Paragraphs -->
      <p v-else-if="block.type === 'p'" class="markdown-paragraph">
        <template v-for="(part, partIndex) in block.content" :key="partIndex">
          <a v-if="part.type === 'link'" :href="part.url" target="_blank" rel="noopener noreferrer">
            {{ part.text }}
          </a>
          <span v-else>{{ part.content }}</span>
        </template>
      </p>
      
      <!-- Unordered Lists -->
      <ul v-else-if="block.type === 'ul'" class="markdown-list markdown-ul">
        <ListItem 
          v-for="(item, itemIndex) in block.items" 
          :key="itemIndex"
          :item="item"
          :is-ordered="false"
        />
      </ul>
      
      <!-- Ordered Lists -->
      <ol v-else-if="block.type === 'ol'" class="markdown-list markdown-ol">
        <ListItem 
          v-for="(item, itemIndex) in block.items" 
          :key="itemIndex"
          :item="item"
          :is-ordered="true"
        />
      </ol>
    </template>
  </div>
</template>

<style scoped>
.markdown-renderer {
  width: 100%;
}

.markdown-heading {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-renderer h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--border-color, #eaecef);
  padding-bottom: 0.3em;
}

.markdown-renderer h2 {
  font-size: 1.5em;
}

.markdown-renderer h3 {
  font-size: 1.25em;
}

.markdown-renderer h4 {
  font-size: 1em;
}

.markdown-paragraph {
  margin-bottom: 1em;
  line-height: 1.8;
}

.markdown-list {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-ul {
  list-style-type: disc;
}

.markdown-ol {
  list-style-type: decimal;
}

.markdown-nested {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.markdown-list-item {
  margin-bottom: 0.5em;
  line-height: 1.8;
}

.markdown-renderer a {
  color: var(--accent-color, #0066cc);
  text-decoration: none;
}

.markdown-renderer a:hover {
  text-decoration: underline;
}
</style>