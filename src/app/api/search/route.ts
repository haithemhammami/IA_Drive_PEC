import { type NextRequest, NextResponse } from "next/server";
import { getProductsByQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  // Extract the 'query' parameter from the request URL
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    // Fetch products from the database that match the 'query' parameter
    const products = await getProductsByQuery(query);
    return NextResponse.json(products); // Return the fetched products as a JSON response
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

