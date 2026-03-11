/**
 * Solar position utility — determines daytime/nighttime.
 * Uses latitude 40°N and assumes user is at the center of their timezone.
 */

const LAT = 40 // degrees N
const DEG = Math.PI / 180

export function isDaytime(date?: Date): boolean {
    const d = date ?? new Date()

    // Day of year
    const start = new Date(d.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000)

    // Solar declination (radians)
    const decl = -23.44 * DEG * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10))

    // Hour angle at sunrise/sunset
    const latRad = LAT * DEG
    const cosOmega = -Math.tan(latRad) * Math.tan(decl)

    // Polar edge cases
    if (cosOmega < -1) return true   // midnight sun
    if (cosOmega > 1) return false   // polar night

    const omega = Math.acos(cosOmega) / DEG // degrees

    // Equation of time (minutes)
    const B = (2 * Math.PI / 365) * (dayOfYear - 81)
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)

    // Solar noon in local clock hours (center-of-timezone assumption → no longitude correction)
    const solarNoon = 12 - EoT / 60

    const sunrise = solarNoon - omega / 15
    const sunset = solarNoon + omega / 15

    const h = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600
    return h >= sunrise && h < sunset
}
