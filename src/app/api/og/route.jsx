import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || 'Countdowns';
        const slug = searchParams.get('slug') || '';

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
                        backgroundColor: '#000000',
                        backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0))',
                        fontFamily: 'sans-serif',
                        color: 'white',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 80px',
                            textAlign: 'center',
                        }}
                    >
                        <h1
                            style={{
                                fontSize: 80,
                                fontWeight: 'bold',
                                lineHeight: 1.1,
                                background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                marginBottom: 20,
                            }}
                        >
                            {title}
                        </h1>
                        {slug && (
                            <p
                                style={{
                                    fontSize: 40,
                                    color: '#a1a1aa',
                                    margin: 0,
                                    marginTop: 20,
                                }}
                            >
                                @{slug}&apos;s Countdowns
                            </p>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 60,
                                padding: '12px 24px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '999px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <span style={{ fontSize: 24, fontWeight: 'medium' }}>countdowns.app</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
