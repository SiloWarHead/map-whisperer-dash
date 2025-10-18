import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function mean(nums: number[]): number | null {
  const filtered = nums.filter((n) => Number.isFinite(n));
  if (!filtered.length) return null;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lat, lng, date } = await req.json();

    if (
      typeof lat !== "string" ||
      typeof lng !== "string" ||
      typeof date !== "string" ||
      !lat || !lng || !date
    ) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return new Response(JSON.stringify({ error: "Invalid coordinates" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const start = encodeURIComponent(date);
    const end = encodeURIComponent(date);

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,snowfall,surface_pressure` +
      `&start_date=${start}&end_date=${end}&wind_speed_unit=kmh&timezone=auto`;

    const resp = await fetch(url);
    if (!resp.ok) {
      const t = await resp.text();
      console.error("Open-Meteo error:", resp.status, t);
      return new Response(JSON.stringify({ error: "Upstream weather API error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const h = data?.hourly ?? {};

    const temps: number[] = (h.temperature_2m ?? []).map((v: any) => Number(v));
    const rhs: number[] = (h.relative_humidity_2m ?? []).map((v: any) => Number(v));
    const winds: number[] = (h.wind_speed_10m ?? []).map((v: any) => Number(v));
    const prec: number[] = (h.precipitation ?? []).map((v: any) => Number(v)); // mm
    const snow: number[] = (h.snowfall ?? []).map((v: any) => Number(v)); // cm
    const pres: number[] = (h.surface_pressure ?? []).map((v: any) => Number(v)); // hPa

    // Air density calculation per hour, then mean
    const airDensities: number[] = [];
    const R_d = 287.05; // J/(kg·K)
    const R_v = 461.495; // J/(kg·K)

    for (let i = 0; i < Math.min(temps.length, rhs.length, pres.length); i++) {
      const Tc = temps[i];
      const RH = rhs[i];
      const P_hPa = pres[i];
      if (!Number.isFinite(Tc) || !Number.isFinite(RH) || !Number.isFinite(P_hPa)) continue;
      const T = Tc + 273.15; // K

      // Magnus formula for saturation vapor pressure (hPa)
      const e_s = 6.112 * Math.exp((17.67 * Tc) / (Tc + 243.5));
      const e = (RH / 100) * e_s; // hPa
      const e_Pa = e * 100; // Pa
      const P_Pa = P_hPa * 100; // Pa

      const rho = (P_Pa - e_Pa) / (R_d * T) + e_Pa / (R_v * T); // kg/m^3
      if (Number.isFinite(rho)) airDensities.push(rho);
    }

    const result = {
      average_temperature: mean(temps),
      average_humidity: mean(rhs),
      average_air_density: mean(airDensities),
      average_wind_speed: mean(winds), // km/h
      total_precipitation: prec.filter(Number.isFinite).reduce((a, b) => a + b, 0), // mm
      total_snowfall: snow.filter(Number.isFinite).reduce((a, b) => a + b, 0), // cm
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("weather function error:", e?.message || e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
