export interface MdxDocsSidebarNode {
  kind: "file" | "folder"
  title: string
  href?: string
  children?: MdxDocsSidebarNode[]
}

export interface MdxTocItem {
  id: string
  text: string
  level: 2 | 3
}
