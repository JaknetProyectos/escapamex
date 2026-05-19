import { Tarifa } from "@/data/experiences";

type TarifaRaw = {
    cantidad: string;
    precio_pp: string;
};

function parseCantidad(cantidad: string): { min: number; max: number | null } {
    const clean = cantidad.trim();

    // Caso "7+"
    if (clean.includes("+")) {
        const min = Number(clean.replace("+", "").trim());
        return { min, max: null };
    }

    // Caso "1 - 3"
    if (clean.includes("-")) {
        const [minStr, maxStr] = clean.split("-");
        return {
            min: Number(minStr.trim()),
            max: Number(maxStr.trim()),
        };
    }

    // Caso fallback (ej: "5")
    const value = Number(clean);
    return { min: value, max: value };
}
export function maptafiras(raw?: TarifaRaw[]): Tarifa[] | undefined {
    if (!raw) return undefined;

    return raw.map((t) => {
        const cleanPrice = t.precio_pp
            .replace("$", "")
            .replace("MXN", "")
            .replace(/,/g, "")
            .trim();

        const { min, max } = parseCantidad(t.cantidad);

        return {
            cantidadLabel: t.cantidad,
            min,
            max,
            precioPorPersona: Number(cleanPrice),
            moneda: "MXN",
        };
    });
}