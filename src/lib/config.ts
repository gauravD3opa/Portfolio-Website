let _cachedConfig: any = null;

export async function fetchConfig() {
  if (_cachedConfig) return _cachedConfig;

  try {
    const res = await fetch("/portfolio-config.json");
    if (!res.ok) throw new Error("failed to load config");
    _cachedConfig = await res.json();
    return _cachedConfig;
  } catch (err) {
    // Return empty object on failure so callers can fall back locally
    _cachedConfig = {};
    return _cachedConfig;
  }
}

export async function getConfigSection(key: string) {
  const cfg = await fetchConfig();
  return cfg?.[key];
}

export function clearConfigCache() {
  _cachedConfig = null;
}
