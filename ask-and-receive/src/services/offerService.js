import { supabase } from "../supabaseClient"

export async function fetchMyHelpOffers(userId) {
    const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching help offers:", error)
        return []
    }

    return data
}

export async function fetchAllOffers() {
    const { data, error } = await supabase
        .from("help_offers")
        .select("*")

    if (error) {
        console.error("Error fetching all offers:", error)
        return []
    }

    return data
}

export async function fetchOffersForAskIds(askIds) {
    if (!askIds || askIds.length === 0) {
        return []
    }

    const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .in("ask_id", askIds)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching offers for my asks:", error)
        return []
    }

    return data
}

export async function updateOfferMessage({
    offerId,
    userId,
    helperMessage,
}) {
    const { error } = await supabase
        .from("help_offers")
        .update({
            helper_message: helperMessage,
        })
        .eq("id", offerId)
        .eq("user_id", userId)

    return { error }
}

export async function withdrawOffer({ offerId, userId }) {
    const { error } = await supabase
        .from("help_offers")
        .delete()
        .eq("id", offerId)
        .eq("user_id", userId)

    return { error }
}

export async function acceptOffer({ offerId, askId }) {
  const { error: acceptError } = await supabase
    .from("help_offers")
    .update({ status: "accepted" })
    .eq("id", offerId)

  if (acceptError) {
    return { error: acceptError }
  }

  const { error: declineError } = await supabase
    .from("help_offers")
    .update({ status: "declined" })
    .eq("ask_id", askId)
    .neq("id", offerId)
    .eq("status", "pending")

  if (declineError) {
    return { error: declineError }
  }

  return { error: null }
}

export async function declineOffer(offerId) {
  const { error } = await supabase
    .from("help_offers")
    .update({ status: "declined" })
    .eq("id", offerId)

  return { error }
}

export async function fulfillOffer({ offerId, askId }) {
  const { error: fulfillError } = await supabase
    .from("help_offers")
    .update({ status: "fulfilled" })
    .eq("id", offerId)

  if (fulfillError) {
    return { error: fulfillError }
  }

  const { error: declineError } = await supabase
    .from("help_offers")
    .update({ status: "declined" })
    .eq("ask_id", askId)
    .neq("id", offerId)

  if (declineError) {
    return { error: declineError }
  }

  return { error: null }
}

export async function findExistingOffer({
  askId,
  userId,
}) {
  const { data, error } = await supabase
    .from("help_offers")
    .select("id")
    .eq("ask_id", askId)
    .eq("user_id", userId)
    .maybeSingle()

  return { data, error }
}

export async function createHelpOffer({
  askId,
  userId,
  helperName,
  helperMessage,
}) {
  const { error } = await supabase
    .from("help_offers")
    .insert([
      {
        ask_id: askId,
        user_id: userId,
        helper_name: helperName,
        helper_message: helperMessage,
      },
    ])

  return { error }
}