"use client"

import { CloudIcon } from "@hugeicons/core-free-icons"

import { defineSearchPlugin } from "../search-helpers"
import type {
  SearchAction,
  SearchWeatherExampleResult,
  SearchPlugin,
} from "../search-types"

export interface OpenMeteoGeocodeResult {
  results?: Array<{
    name: string
    country?: string
    admin1?: string
    latitude: number
    longitude: number
  }>
}

export interface OpenMeteoForecastResult {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    weather_code?: number
    wind_speed_10m?: number
  }
  current_units?: {
    temperature_2m?: string
    apparent_temperature?: string
    wind_speed_10m?: string
  }
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
}

const formatLocation = ({
  name,
  admin1,
  country,
}: {
  name: string
  admin1?: string
  country?: string
}) => [name, admin1, country].filter(Boolean).join(", ")

const getCurrentWeather = async (
  city: string,
  signal?: AbortSignal,
): Promise<SearchWeatherExampleResult> => {
  const geocodingResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    { signal },
  )

  if (!geocodingResponse.ok) {
    throw new Error("Open-Meteo geocoding request failed")
  }

  const geocodingPayload = (await geocodingResponse.json()) as OpenMeteoGeocodeResult
  const match = geocodingPayload.results?.[0]

  if (!match) {
    throw new Error(`No city found for "${city}"`)
  }

  const forecastResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${match.latitude}&longitude=${match.longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
    { signal },
  )

  if (!forecastResponse.ok) {
    throw new Error("Open-Meteo weather request failed")
  }

  const forecastPayload = (await forecastResponse.json()) as OpenMeteoForecastResult
  const current = forecastPayload.current

  if (!current?.temperature_2m && current?.temperature_2m !== 0) {
    throw new Error("Open-Meteo returned no current weather")
  }

  return {
    location: formatLocation(match),
    summary: WEATHER_CODE_LABELS[current.weather_code ?? -1] ?? "Current conditions available",
    temperature: `${current.temperature_2m}${forecastPayload.current_units?.temperature_2m ?? "°C"}`,
    apparentTemperature:
      current.apparent_temperature !== undefined
        ? `${current.apparent_temperature}${forecastPayload.current_units?.apparent_temperature ?? "°C"}`
        : null,
    wind:
      current.wind_speed_10m !== undefined
        ? `${current.wind_speed_10m}${forecastPayload.current_units?.wind_speed_10m ?? " km/h"}`
        : null,
  }
}

const weatherExamplePlugin: SearchPlugin = defineSearchPlugin({
  id: "weather-example",
  getActions: (context): SearchAction[] => {
    const city = context.query.trim()
    const { weatherExample } = context
    const weatherInputActions: SearchAction[] =
      city.length < 2
        ? [
            {
              id: "weather-example:input-hint",
              title: "Enter a city name",
              description: 'Try "Copenhagen", "Tokyo", or "San Francisco"',
              section: "Weather",
              icon: CloudIcon,
              disabled: true,
              keywords: ["weather", "city", "input", "open-meteo"],
            },
          ]
        : weatherExample.isLoading
          ? [
              {
                id: "weather-example:loading",
                title: `Loading weather for "${city}"...`,
                description: "Fetching current conditions from Open-Meteo",
                section: "Weather",
                icon: CloudIcon,
                disabled: true,
                keywords: [city, "weather", "loading", "open-meteo"],
              },
            ]
          : weatherExample.error
            ? [
                {
                  id: "weather-example:error",
                  title: "Could not load weather",
                  description: weatherExample.error,
                  section: "Weather",
                  icon: CloudIcon,
                  disabled: true,
                  keywords: [city, "weather", "error", "open-meteo"],
                },
                {
                  id: `weather-example:refresh:${city.toLowerCase()}`,
                  title: `Retry weather lookup for "${city}"`,
                  description: "Fetch current conditions again",
                  section: "Weather",
                  icon: CloudIcon,
                  keywords: [city, "weather", "retry", "refresh"],
                  perform: () => {
                    context.weatherExample.refresh()
                  },
                },
              ]
            : weatherExample.result
              ? [
                  {
                    id: "weather-example:result-summary",
                    title: `${weatherExample.result.temperature} • ${weatherExample.result.summary}`,
                    description: weatherExample.result.location,
                    section: "Weather",
                    icon: CloudIcon,
                    disabled: true,
                    keywords: [city, "weather", "summary", weatherExample.result.summary],
                  },
                  ...(weatherExample.result.apparentTemperature
                    ? [
                        {
                          id: "weather-example:result-feels-like",
                          title: `Feels like ${weatherExample.result.apparentTemperature}`,
                          description: "Apparent temperature",
                          section: "Weather",
                          icon: CloudIcon,
                          disabled: true,
                          keywords: [city, "feels like", "apparent temperature"],
                        } satisfies SearchAction,
                      ]
                    : []),
                  ...(weatherExample.result.wind
                    ? [
                        {
                          id: "weather-example:result-wind",
                          title: `Wind ${weatherExample.result.wind}`,
                          description: "Wind speed",
                          section: "Weather",
                          icon: CloudIcon,
                          disabled: true,
                          keywords: [city, "wind", "weather"],
                        } satisfies SearchAction,
                      ]
                    : []),
                  {
                    id: `weather-example:refresh:${city.toLowerCase()}`,
                    title: `Refresh weather for "${city}"`,
                    description: "Fetch the latest current conditions",
                    section: "Weather",
                    icon: CloudIcon,
                    keywords: [city, "weather", "refresh", "open-meteo"],
                    perform: () => {
                      context.weatherExample.refresh()
                    },
                  },
                ]
              : [
            {
              id: "weather-example:waiting",
              title: `Preparing weather for "${city}"`,
              description: "Weather results will appear here",
              section: "Weather",
              icon: CloudIcon,
              disabled: true,
              keywords: [city, "weather", "forecast", "open-meteo", "temperature"],
            },
          ]

    return [
      {
        id: "weather-example:check",
        title: "Check weather",
        description: "Open the weather plugin",
        section: "Examples",
        icon: CloudIcon,
        keywords: ["weather", "forecast", "open-meteo", "city", "example"],
        view: {
          inputPlaceholder: "Enter a city name...",
          emptyTitle: "Type a city name",
          emptyDescription: "The weather plugin uses this field as its city input.",
          queryOnOpen: "clear",
        },
        children: weatherInputActions,
      },
      ...(city.length >= 2
        ? [
            {
              id: `weather-example:search:${city.toLowerCase()}`,
              title: `Weather in "${city}"`,
              description: "Open the weather plugin with this city prefilled",
              section: "Examples",
              icon: CloudIcon,
              keywords: [city, "weather", "forecast", "open-meteo", "temperature"],
              view: {
                inputPlaceholder: "Enter a city name...",
                emptyTitle: "No weather action yet",
                emptyDescription: "Keep typing a city name to fetch the current weather.",
                queryOnOpen: "preserve",
              },
              children: weatherInputActions,
            } satisfies SearchAction,
          ]
        : []),
    ]
  },
})

export { weatherExamplePlugin }
export { getCurrentWeather }
