import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../lib/supabase/admin"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Top selling products
    const { data: topProducts } = await supabaseAdmin
      .from("order_items")
      .select(
        `
        product_name,
        product_price,
        quantity,
        orders!inner(created_at, paystack_status)
      `,
      )
      .gte("orders.created_at", startDate.toISOString())
      .eq("orders.paystack_status", "success")

    // Aggregate top products
    const productStats = {}
    topProducts?.forEach((item) => {
      const key = item.product_name
      if (!productStats[key]) {
        productStats[key] = {
          product_name: item.product_name,
          total_quantity: 0,
          total_revenue: 0,
        }
      }
      productStats[key].total_quantity += item.quantity
      productStats[key].total_revenue += item.product_price * item.quantity
    })

    const topProductsArray = Object.values(productStats)
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 10)

    // Orders by status
    const { data: ordersByStatus } = await supabaseAdmin
      .from("orders")
      .select("order_status")
      .gte("created_at", startDate.toISOString())

    const statusCounts = {}
    ordersByStatus?.forEach((order) => {
      statusCounts[order.order_status] = (statusCounts[order.order_status] || 0) + 1
    })

    const ordersByStatusArray = Object.entries(statusCounts).map(([status, count]) => ({
      order_status: status,
      count,
    }))

    // Revenue by city
    const { data: revenueByCity } = await supabaseAdmin
      .from("orders")
      .select("delivery_city, total_amount")
      .gte("created_at", startDate.toISOString())
      .eq("paystack_status", "success")

    const cityStats = {}
    revenueByCity?.forEach((order) => {
      const city = order.delivery_city
      if (!cityStats[city]) {
        cityStats[city] = {
          delivery_city: city,
          total_revenue: 0,
          order_count: 0,
        }
      }
      cityStats[city].total_revenue += order.total_amount
      cityStats[city].order_count += 1
    })

    const revenueByCityArray = Object.values(cityStats).sort((a, b) => b.total_revenue - a.total_revenue)

    // Promo code usage
    const { data: promoUsage } = await supabaseAdmin
      .from("orders")
      .select("promo_code, discount_amount")
      .gte("created_at", startDate.toISOString())
      .eq("paystack_status", "success")
      .not("promo_code", "is", null)

    const promoStats = {}
    promoUsage?.forEach((order) => {
      const code = order.promo_code
      if (!promoStats[code]) {
        promoStats[code] = {
          promo_code: code,
          usage_count: 0,
          total_discount: 0,
        }
      }
      promoStats[code].usage_count += 1
      promoStats[code].total_discount += order.discount_amount || 0
    })

    const promoUsageArray = Object.values(promoStats).sort((a, b) => b.total_discount - a.total_discount)

    return NextResponse.json({
      topProducts: topProductsArray,
      ordersByStatus: ordersByStatusArray,
      revenueByCity: revenueByCityArray,
      promoCodeUsage: promoUsageArray,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
