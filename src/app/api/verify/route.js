import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { password } = await request.json();
        const isValid = password === process.env.ADMIN_PASSWORD;

        if (isValid) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
