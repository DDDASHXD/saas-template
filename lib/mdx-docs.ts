import "server-only"

import fs from "node:fs/promises"
import path from "node:path"
import { cache } from "react"

import { siteConfig } from "@/config"
import type { DashboardRailItem } from "@/types"
import type { MdxDocsSidebarNode, MdxTocItem } from "@/types/docs"

const MDX_EXTENSIONS = new Set([".mdx", ".md"])

interface FrontmatterData {
  title?: string
  description?: string
}

interface ParsedFrontmatter {
  data: FrontmatterData
  body: string
}

interface MdxDirectoryResult {
  nodes: MdxDocsSidebarNode[]
  indexHref?: string
}

export interface MdxDocument {
  title: string
  description: string | null
  source: string
  toc: MdxTocItem[]
  href: string
}

const formatLabel = (value: string) => {
  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const sanitizeFolderPath = (folder: string) => folder.replace(/^\/+/, "")

const isMdxFile = (fileName: string) => {
  const extension = path.extname(fileName).toLowerCase()
  return MDX_EXTENSIONS.has(extension)
}

const withoutExtension = (fileName: string) => {
  return fileName.replace(/\.(md|mdx)$/i, "")
}

const stripFrontmatter = (source: string) => {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
}

const parseFrontmatter = (source: string): ParsedFrontmatter => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { data: {}, body: source }
  }

  const rawBlock = match[1]
  const data: FrontmatterData = {}

  for (const line of rawBlock.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":")
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "")

    if (key === "title") {
      data.title = value
    }

    if (key === "description") {
      data.description = value
    }
  }

  return {
    data,
    body: source.slice(match[0].length),
  }
}

const stripHeadingFormatting = (value: string) => {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{[^}]+\}/g, "")
    .replace(/[*_~#]/g, "")
    .trim()
}

export const createSlugger = () => {
  const counts = new Map<string, number>()

  return (value: string) => {
    const base = value
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    const safeBase = base || "section"
    const count = counts.get(safeBase) ?? 0
    counts.set(safeBase, count + 1)

    return count === 0 ? safeBase : `${safeBase}-${count}`
  }
}

const extractTitleFromBody = (body: string) => {
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^#\s+(.+)$/)
    if (match) {
      return stripHeadingFormatting(match[1])
    }
  }

  return null
}

const extractDescriptionFromBody = (body: string) => {
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith(">")) {
      continue
    }
    return trimmed
  }

  return null
}

const normalizeHref = (baseHref: string, slugParts: string[]) => {
  if (slugParts.length === 0) {
    return baseHref
  }
  return `${baseHref}/${slugParts.join("/")}`
}

const readMdxTitle = async (filePath: string, fallback: string) => {
  const source = await fs.readFile(filePath, "utf8")
  const { data, body } = parseFrontmatter(source)

  return data.title || extractTitleFromBody(body) || fallback
}

const resolveMdxRailItem = (href: string): DashboardRailItem | null => {
  const item = siteConfig.dashboard.sidebar.items.find(
    (sidebarItem) => sidebarItem.href === href && sidebarItem.type === "mdx"
  )

  if (!item || !item.folder) {
    return null
  }

  return item
}

const resolveMdxRootPath = (item: DashboardRailItem) => {
  const folder = sanitizeFolderPath(item.folder ?? "")
  return path.join(process.cwd(), folder)
}

const pathExists = async (filePath: string) => {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

const walkDirectory = async (
  directoryPath: string,
  slugParts: string[],
  baseHref: string,
  includeRootIndex: boolean
): Promise<MdxDirectoryResult> => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true })
  const visibleEntries = entries.filter((entry) => !entry.name.startsWith("."))

  const folderEntries = visibleEntries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  const fileEntries = visibleEntries
    .filter((entry) => entry.isFile() && isMdxFile(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))

  const nodes: MdxDocsSidebarNode[] = []
  let indexHref: string | undefined

  for (const fileEntry of fileEntries) {
    const baseName = withoutExtension(fileEntry.name)
    const nextSlug = baseName === "index" ? slugParts : [...slugParts, baseName]
    const href = normalizeHref(baseHref, nextSlug)
    const filePath = path.join(directoryPath, fileEntry.name)
    const fallbackTitle = baseName === "index" ? "Overview" : formatLabel(baseName)
    const title = await readMdxTitle(filePath, fallbackTitle)

    if (baseName === "index") {
      indexHref = href
      if (includeRootIndex) {
        nodes.push({ kind: "file", href, title })
      }
      continue
    }

    nodes.push({ kind: "file", href, title })
  }

  for (const folderEntry of folderEntries) {
    const childSlugParts = [...slugParts, folderEntry.name]
    const childDirectoryPath = path.join(directoryPath, folderEntry.name)
    const childResult = await walkDirectory(childDirectoryPath, childSlugParts, baseHref, false)

    if (childResult.nodes.length === 0 && !childResult.indexHref) {
      continue
    }

    nodes.push({
      kind: "folder",
      title: formatLabel(folderEntry.name),
      href: childResult.indexHref,
      children: childResult.nodes,
    })
  }

  return { nodes, indexHref }
}

const resolveDocumentFilePath = async (rootPath: string, slugParts: string[]) => {
  const joinedPath = path.join(rootPath, ...slugParts)
  const candidates =
    slugParts.length === 0
      ? [path.join(rootPath, "index.mdx"), path.join(rootPath, "index.md")]
      : [
          `${joinedPath}.mdx`,
          `${joinedPath}.md`,
          path.join(joinedPath, "index.mdx"),
          path.join(joinedPath, "index.md"),
        ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate
    }
  }

  return null
}

export const extractToc = (source: string): MdxTocItem[] => {
  const body = stripFrontmatter(source)
  const lines = body.split(/\r?\n/)
  const toSlug = createSlugger()
  const toc: MdxTocItem[] = []

  let insideCodeFence = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("```")) {
      insideCodeFence = !insideCodeFence
      continue
    }

    if (insideCodeFence) {
      continue
    }

    const match = trimmed.match(/^(##|###)\s+(.+)$/)
    if (!match) {
      continue
    }

    const level = match[1].length as 2 | 3
    const text = stripHeadingFormatting(match[2])
    const id = toSlug(text)
    toc.push({ id, text, level })
  }

  return toc
}

export const getMdxSidebarTree = cache(async (href: string): Promise<MdxDocsSidebarNode[]> => {
  const item = resolveMdxRailItem(href)
  if (!item) {
    return []
  }

  const rootPath = resolveMdxRootPath(item)
  if (!(await pathExists(rootPath))) {
    return []
  }

  const result = await walkDirectory(rootPath, [], href, true)
  return result.nodes
})

export const getMdxDocument = cache(
  async (href: string, slugParts: string[]): Promise<MdxDocument | null> => {
    const item = resolveMdxRailItem(href)
    if (!item) {
      return null
    }

    const rootPath = resolveMdxRootPath(item)
    const filePath = await resolveDocumentFilePath(rootPath, slugParts)

    if (!filePath) {
      return null
    }

    const source = await fs.readFile(filePath, "utf8")
    const { data, body } = parseFrontmatter(source)

    const relativePath = path
      .relative(rootPath, filePath)
      .replace(/\\/g, "/")
      .replace(/\.(md|mdx)$/i, "")
    const relativeSlugParts = relativePath.split("/").filter(Boolean)
    const canonicalSlugParts =
      relativeSlugParts.at(-1) === "index"
        ? relativeSlugParts.slice(0, -1)
        : relativeSlugParts

    const title =
      data.title ||
      extractTitleFromBody(body) ||
      formatLabel(canonicalSlugParts.at(-1) || "Overview")

    const description = data.description || extractDescriptionFromBody(body)

    return {
      title,
      description,
      source: body,
      toc: extractToc(body),
      href: normalizeHref(href, canonicalSlugParts),
    }
  }
)
