// Single source of truth for personal projects.
// Used by the Projects page, the Home page (featured), and the Resume "Projects" tab.
//
// Fields:
// - title, description, technologies: shown on every card
// - image: optional screenshot/icon; cards without one get a generated placeholder
// - link: where the card goes (GitHub repo or live site)
// - featured: shown in the top section of the Projects page and on the Home page

const ASSETS = "https://raw.githubusercontent.com/nexfortisme/asset-store/refs/heads/main";

export const projects = [
  {
    title: "Relay",
    image: `${ASSETS}/relay_homepage.png`,
    description:
      "An AI chat application with all of the dials and features in a more user-friendly interface that gives the user more control over the conversation and their data. Uses local models to interact with their data and stores it all locally. An exercise in learning and creating an application that I would want to use myself through the use of AI tools. Created using Cursor, Claude Code, Codex and GitHub Copilot.",
    technologies: ["Vue.js", "SQLite", "Golang", "MCPs", "RAG", "Cursor", "Claude Code", "Codex", "GitHub Copilot"],
    link: "https://github.com/nexfortisme/relay",
    featured: true,
  },
  {
    title: "Bart",
    image: "https://raw.githubusercontent.com/nexfortisme/Bart/refs/heads/main/resources/pictures/bart_icon.png?raw=true",
    description:
      "Next evolution of Bot Person but using a more natural means of communication; through just a normal discord chat instead of through slash commands or special alert keywords or characters. It uses MCPs, model embeddings, and KNN classifiers to understand the context of the conversation and respond accordingly.",
    technologies: ["SQLite", "DiscordGo", "Golang", "MCPs", "Model Embeddings", "KNN Classifiers", "Local Model Hosting"],
    link: "https://github.com/nexfortisme/bart",
    featured: true,
  },
  {
    title: "Bot Person",
    image: "https://github.com/nexfortisme/asset-store/blob/main/Wracker%20New.jpg?raw=true",
    description:
      "A Discord bot with ChatGPT, Dall-e, and Sora integration. Started as a fun side project for friends but evolved into a more robust utility with cost management features. Picture comes from a friend, who I have permission from to use, but it kind of became the icon for the bot.",
    technologies: ["SQLite", "DiscordGo", "OpenAI API", "Golang"],
    link: "https://github.com/nexfortisme/bot-person",
    featured: true,
  },
  {
    title: "OSS Forums",
    image: "https://github.com/nexfortisme/asset-store/blob/main/OSSForumsHomePage.png?raw=true",
    description:
      "A simple, old-school, forum I'm working on because I got tired of all of the needless data collection of modern software. It's a simple, self hostable forum that allows you to create categories and topics and post to them.",
    technologies: ["Vue.js", "BunJS", "HonoJS", "SQLite"],
    link: "https://github.com/nexfortisme/oss-forums",
    featured: true,
  },
  {
    title: "Game Night Bot",
    description:
      "A Discord bot that keeps track of a group's game recommendations, backlog, and play history per server. Slash commands handle structured edits, while @mentions go through an LLM agent that can update the same data through MCP tools, so you can just paste a list and let it sort things out.",
    technologies: ["TypeScript", "BunJS", "discord.js", "MCPs", "SQLite", "Docker"],
    link: "https://github.com/nexfortisme/game-night-bot",
  },
  {
    title: "FBI Bot",
    description:
      "A joke Discord bot that replies to @mentions with snarky, LLM-generated \"FBI agent\" remarks, randomly hops into voice channels to play a short clip, and occasionally reacts to messages with 👀. Runs against a local OpenAI-compatible model and compiles to a single binary.",
    technologies: ["TypeScript", "BunJS", "discord.js", "Local LLMs", "FFmpeg"],
    link: "https://github.com/nexfortisme/fbi-bot",
  },
  {
    title: "LLM Classifier Example",
    description:
      "A small proof of concept for figuring out how model embeddings and nearest-neighbour classification can detect message intent. It seeds a vector store from a synthetic dataset and then classifies incoming chat messages, and became the groundwork for Bart's intent detection.",
    technologies: ["Golang", "Model Embeddings", "KNN Classifiers", "LM Studio"],
    link: "https://github.com/nexfortisme/llm-classifier-example",
  },
  {
    title: "Dummyurl.foo",
    image: `${ASSETS}/dummyurl-foo.png`,
    description:
      "I bought the domain a while ago to prevent abuse of it since I was using it in testing. I finally got around to making a simple tester for response codes. Super simple, no real plans for it.",
    technologies: ["TypeScript", "Cloudflare Workers"],
    link: "https://dummyurl.foo",
  },
  {
    title: "This Website",
    image: "https://github.com/nexfortisme/asset-store/blob/main/website_screenshot.png?raw=true",
    description:
      "My personal blog and portfolio website built with Vue.js. Serves as both a resume and a place to document interesting things I come across. Posts are pulled from a separate content repo and indexed by a small Go script.",
    technologies: ["Vue.js", "Vite", "JavaScript", "CSS", "Golang"],
    link: "https://github.com/nexfortisme/blog",
  },
  {
    title: "Advent of Code 2025",
    description:
      "My solutions for the 2025 Advent of Code puzzles. A yearly excuse to sharpen problem solving and try out a different runtime, this time Deno.",
    technologies: ["TypeScript", "Deno"],
    link: "https://github.com/nexfortisme/Advent-of-Code-2025",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
