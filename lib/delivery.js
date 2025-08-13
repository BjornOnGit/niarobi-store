import { supabase } from "./supabase/client" // Import from the new client-side file

export async function getDeliveryFee(city) {
  if (!city) {
    return 0 // No city selected, no delivery fee
  }

  try {
    const { data, error } = await supabase.from("delivery_fees").select("fee").eq("city", city).single()

    if (error) {
      console.error(`Error fetching delivery fee for ${city}:`, error)
      return 0 // Default to 0 on error
    }

    return data ? data.fee : 0
  } catch (error) {
    console.error(`Unexpected error fetching delivery fee for ${city}:`, error)
    return 0
  }
}
