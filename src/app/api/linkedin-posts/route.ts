import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

interface LinkedInPost {
  id: string
  text: string
  author: string
  date: string
  postUrl: string
  imageUrl?: string
  engagement?: {
    likes: number
    comments: number
  }
}

export async function GET() {
  try {
    // LinkedIn profile URL (the one with most followers)
    const profileUrl = 'https://www.linkedin.com/in/amhydraulicsandtubes/'
    
    // Fetch the LinkedIn page
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch LinkedIn page: ${response.status}`)
    }

    const html = await response.text()
    
    // Parse posts from HTML
    const posts: LinkedInPost[] = []
    
    // Try to extract basic information from the page
    // LinkedIn's HTML structure for public profiles
    const postMatches = html.matchAll(/<article[^>]*>(.*?)<\/article>/gs)
    
    let postId = 1
    for (const match of postMatches) {
      const articleHtml = match[1]
      
      // Extract text content
      const textMatch = articleHtml.match(/<span[^>]*class="[^"]*break-words[^"]*"[^>]*>(.*?)<\/span>/s)
      const text = textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : ''
      
      // Extract date
      const dateMatch = articleHtml.match(/<time[^>]*datetime="([^"]*)"/)
      const date = dateMatch ? dateMatch[1] : new Date().toISOString()
      
      // Extract post URL
      const urlMatch = articleHtml.match(/href="([^"]*\/posts\/[^"]*)"/)
      const postUrl = urlMatch ? `https://www.linkedin.com${urlMatch[1]}` : profileUrl
      
      if (text && text.length > 20) {
        posts.push({
          id: `post-${postId++}`,
          text: text.substring(0, 300) + (text.length > 300 ? '...' : ''),
          author: 'AM Hydraulics and Tubes',
          date,
          postUrl,
        })
      }
      
      if (posts.length >= 6) break // Limit to 6 posts
    }

    // If no posts were extracted, return mock data to show the section works
    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        posts: [],
        message: 'LinkedIn posts are available on our profile',
        profileUrl,
        companyUrl: 'https://www.linkedin.com/company/amhydraulicsandtubes/posts/'
      })
    }

    return NextResponse.json({
      success: true,
      posts,
      profileUrl,
      companyUrl: 'https://www.linkedin.com/company/amhydraulicsandtubes/posts/'
    })

  } catch (error) {
    console.error('Error fetching LinkedIn posts:', error)
    
    // Return graceful fallback
    return NextResponse.json({
      success: false,
      posts: [],
      message: 'Unable to fetch posts at this time',
      profileUrl: 'https://www.linkedin.com/in/amhydraulicsandtubes/',
      companyUrl: 'https://www.linkedin.com/company/amhydraulicsandtubes/posts/'
    })
  }
}
