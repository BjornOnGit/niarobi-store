import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../lib/supabase/admin" // Use the admin client for server-side operations

export async function POST(request) {
  try {
    const { productId, userId, rating, reviewText } = await request.json()

    if (!productId || !userId || !rating) {
      return NextResponse.json({ error: "Product ID, User ID, and Rating are required." }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
    }

    // Check if the user has already reviewed this product
    const { data: existingReview, error: existingReviewError } = await supabaseAdmin
      .from("product_reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single()

    if (existingReviewError && existingReviewError.code !== "PGRST116") {
      // PGRST116 means no rows found
      console.error("Error checking for existing review:", existingReviewError)
      return NextResponse.json({ error: "Failed to check for existing review." }, { status: 500 })
    }

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 })
    }

    // Insert the new review
    const { data, error } = await supabaseAdmin
      .from("product_reviews")
      .insert({
        product_id: productId,
        user_id: userId,
        rating: rating,
        review_text: reviewText || null, // Allow null for empty review text
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting review:", error)
      return NextResponse.json({ error: "Failed to submit review." }, { status: 500 })
    }

    return NextResponse.json({ message: "Review submitted successfully!", review: data }, { status: 201 })
  } catch (error) {
    console.error("Error in reviews API (POST):", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 })
    }

    // First, fetch the reviews without the join
    const { data: reviews, error } = await supabaseAdmin
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 })
    }

    // If there are reviews, fetch user emails separately using raw SQL
    let reviewsWithUserEmails = reviews
    if (reviews && reviews.length > 0) {
      const userIds = [...new Set(reviews.map((review) => review.user_id))] // Get unique user IDs

      try {
        // Use raw SQL query to access auth.users table
        const { data: users, error: usersError } = await supabaseAdmin.rpc('get_user_emails', {
          user_ids: userIds
        })

        if (usersError) {
          console.error("Error fetching user emails via RPC:", usersError)
          // Try alternative approach with direct auth admin client
          try {
            const userEmailMap = {}
            
            // Fetch user emails one by one using the auth admin client
            for (const userId of userIds) {
              try {
                const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
                if (!userError && userData.user) {
                  userEmailMap[userId] = userData.user.email
                }
              } catch (individualUserError) {
                console.error(`Error fetching user ${userId}:`, individualUserError)
                userEmailMap[userId] = "Anonymous"
              }
            }

            reviewsWithUserEmails = reviews.map((review) => ({
              ...review,
              users: { email: userEmailMap[review.user_id] || "Anonymous" },
            }))
          } catch (authAdminError) {
            console.error("Error using auth admin client:", authAdminError)
            // Final fallback - show all as anonymous
            reviewsWithUserEmails = reviews.map((review) => ({
              ...review,
              users: { email: "Anonymous" },
            }))
          }
        } else {
          // Map user emails to reviews using RPC result
          const userEmailMap = {}
          users.forEach((user) => {
            userEmailMap[user.id] = user.email
          })

          reviewsWithUserEmails = reviews.map((review) => ({
            ...review,
            users: { email: userEmailMap[review.user_id] || "Anonymous" },
          }))
        }
      } catch (userFetchError) {
        console.error("Error in user fetch operation:", userFetchError)
        // Continue without user emails if this fails
        reviewsWithUserEmails = reviews.map((review) => ({
          ...review,
          users: { email: "Anonymous" },
        }))
      }
    }

    // Calculate average rating
    const totalRatings = reviewsWithUserEmails.reduce((sum, review) => sum + review.rating, 0)
    const averageRating =
      reviewsWithUserEmails.length > 0 ? (totalRatings / reviewsWithUserEmails.length).toFixed(1) : 0

    return NextResponse.json(
      {
        reviews: reviewsWithUserEmails,
        averageRating,
        totalReviews: reviewsWithUserEmails.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in reviews API (GET):", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
