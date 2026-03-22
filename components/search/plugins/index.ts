"use client"

import { navigationPlugin } from "./navigation-plugin"
import { namesApiExamplePlugin } from "./names-api-example-plugin"
import { organizationPlugin } from "./organization-plugin"
import { settingsPlugin } from "./settings-plugin"
import { weatherExamplePlugin } from "./weather-example-plugin"
import { workspacePlugin } from "./workspace-plugin"

export const defaultSearchPlugins = [
  navigationPlugin,
  settingsPlugin,
  namesApiExamplePlugin,
  organizationPlugin,
  weatherExamplePlugin,
  workspacePlugin,
]
