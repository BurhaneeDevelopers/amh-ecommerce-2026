'use client'

import React, { useEffect } from 'react'
import { Container } from '../container'
import { Linkedin, ExternalLink, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function LinkedInPostsSection() {
  const companyPageUrl = 'https://www.linkedin.com/company/amhydraulicsandtubes/posts/'
  const profilePageUrl = 'https://www.linkedin.com/in/amhydraulicsandtubes/'

  useEffect(() => {
    // Load LinkedIn platform script
    const script = document.createElement('script')
    script.src = 'https://platform.linkedin.com/in.js'
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <Container>
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Linkedin className="w-8 h-8 text-[#0A66C2]" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Connect With Us on LinkedIn
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with our latest news, products, and industry insights from AM Hydraulics and Tubes
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* LinkedIn Profile Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-[#0A66C2]/10 rounded-lg group-hover:bg-[#0A66C2]/20 transition-colors">
                    <Linkedin className="w-8 h-8 text-[#0A66C2]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Company Page</h3>
                    <p className="text-sm text-muted-foreground">
                      Official company updates and announcements
                    </p>
                  </div>
                </div>
                <a
                  href={companyPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  View Company Posts
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-[#0A66C2]/10 rounded-lg group-hover:bg-[#0A66C2]/20 transition-colors">
                    <TrendingUp className="w-8 h-8 text-[#0A66C2]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Profile Page</h3>
                    <p className="text-sm text-muted-foreground">
                      Most followed page with regular updates
                    </p>
                  </div>
                </div>
                <a
                  href={profilePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Follow Our Profile
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* LinkedIn Feed Embed */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">Latest Updates</h3>
              <p className="text-muted-foreground">
                See what we're sharing with our LinkedIn community
              </p>
            </div>

            {/* Embedded LinkedIn Feed using Widgets.so or similar service */}
            <Card className="overflow-hidden border-2">
              <CardContent className="p-0">
                <div className="relative w-full bg-muted/30" style={{ minHeight: '500px' }}>
                  {/* LinkedIn Profile Badge */}
                  <div className="p-8">
                    <div className="max-w-3xl mx-auto">
                      {/* LinkedIn Company Profile Plugin */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-[#0A66C2] rounded-lg flex items-center justify-center">
                            <Linkedin className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">AM Hydraulics and Tubes</h4>
                            <p className="text-sm text-muted-foreground">Hydraulics & Tubes Solutions</p>
                          </div>
                        </div>
                        
                        {/* LinkedIn Follow Button */}
                        <div className="flex justify-center py-4">
                          <div 
                            dangerouslySetInnerHTML={{
                              __html: `<script type="IN/FollowCompany" data-id="amhydraulicsandtubes" data-counter="bottom"></script>`
                            }}
                          />
                        </div>
                      </div>

                      {/* Posts Preview Cards */}
                      <div className="grid gap-4">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">AM Hydraulics and Tubes</p>
                                <p className="text-xs text-muted-foreground">Recent post</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-muted rounded w-full animate-pulse" />
                              <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
                              <div className="h-3 bg-muted rounded w-4/6 animate-pulse" />
                            </div>
                            <div className="mt-4 pt-4 border-t flex gap-4 text-sm text-muted-foreground">
                              <span>👍 Like</span>
                              <span>💬 Comment</span>
                              <span>🔄 Share</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="overflow-hidden border-2 bg-gradient-to-br from-[#0A66C2]/5 to-[#0A66C2]/10">
              <CardContent className="p-8 text-center">
                <Linkedin className="w-12 h-12 text-[#0A66C2] mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-3">
                  See All Our Posts on LinkedIn
                </h4>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  For the best experience and to engage with our content, visit our LinkedIn pages directly. 
                  Like, comment, and share our posts to stay connected with AM Hydraulics and Tubes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={profilePageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Linkedin className="w-5 h-5" />
                    Visit Profile Page
                  </a>
                  <a
                    href={companyPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Visit Company Page
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}
