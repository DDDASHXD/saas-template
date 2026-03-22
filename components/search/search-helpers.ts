"use client"

import type { SearchAction } from "./search-types"

export const defineSearchPlugin = <T,>(plugin: T) => plugin

export const createSearchAction = (action: SearchAction) => action

export const createRouteAction = ({
  href,
  keywords,
  ...action
}: Omit<SearchAction, "perform"> & {
  href: string
}) =>
  createSearchAction({
    ...action,
    keywords: [...(keywords ?? []), href],
  })
