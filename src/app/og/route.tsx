import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'A.M. Hydraulics & Tubes';
    const brand = searchParams.get('brand');
    const category = searchParams.get('category');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #fef5f0 0%, #ffffff 50%, #fff8f0 100%)',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #ff6b35 0%, #e55a25 50%, #ff6b35 100%)',
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 60px',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: title.length > 60 ? '48px' : '56px',
                fontWeight: 'bold',
                color: '#2d2d2d',
                textAlign: 'center',
                marginBottom: '30px',
                lineHeight: 1.2,
                maxWidth: '1000px',
                display: 'flex',
              }}
            >
              {title}
            </div>

            {/* Brand Badge */}
            {brand && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ff6b35',
                  color: '#ffffff',
                  padding: '12px 32px',
                  borderRadius: '50px',
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '20px',
                }}
              >
                {brand}
              </div>
            )}

            {/* Category */}
            {category && (
              <div
                style={{
                  fontSize: '22px',
                  color: '#6b6b6b',
                  marginBottom: '40px',
                  display: 'flex',
                }}
              >
                {category}
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                width: '120px',
                height: '4px',
                backgroundColor: '#ff6b35',
                borderRadius: '2px',
                marginBottom: '40px',
                display: 'flex',
              }}
            />

            {/* Company Info */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#2d2d2d',
                  display: 'flex',
                }}
              >
                A.M. Hydraulics & Tubes
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#6b6b6b',
                  display: 'flex',
                }}
              >
                Authorized Stockist • Chennai, India • ISO 9001:2015
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: '#8b5cf6',
                  fontWeight: '600',
                  display: 'flex',
                }}
              >
                hydraulicstore.in
              </div>
            </div>
          </div>

          {/* Bottom Accent */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 50%, #8b5cf6 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
