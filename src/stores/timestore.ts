import { derived, readable, writable } from 'svelte/store'
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";
import type { SettingsGetter } from "../settings";

const regex = /(\d{1,2}):(\d{2})/gm;

const showTimezone = function (timezone: string, format: string, override) {
  const today = new Date();
  if (override) {
    const match = override.matchAll(regex);
    if (match) {
      try {
        const [[, hour, minutes],] = [...match]
        today.setHours(parseInt(hour))
        today.setMinutes(parseInt(minutes))
      } catch (error) { }
    }
  }
  return formatInTimeZone(today, timezone, format);
};

const calculateTimes = function (
  timezones: Array<string>,
  settingsGetter: SettingsGetter,
  override,
) {
  const settings = settingsGetter()
  return timezones.reduce((o, i) => {
    const offset = getTimezoneOffset(i);
    o[offset] = showTimezone(i, settings.format, override);
    return o;
  }, {});
};

export const timestore = function (
  timezones: Array<string>,
  settingsGetter: SettingsGetter,
  override,
) {
  // const times = readable(calculateTimes(timezones, settingsGetter), set => {
  //   const update = () => set(calculateTimes(timezones, settingsGetter))
  //   const interval = setInterval(update, 1000)
  //   return () => clearInterval(interval)
  // });
  return derived(override, ($override, set) => {
    const update = () => set(calculateTimes(timezones, settingsGetter, $override))
    const interval = setInterval(update, 1000)
    update()
    return () => clearInterval(interval)
  })
}

export const timeoverride = writable(null);
