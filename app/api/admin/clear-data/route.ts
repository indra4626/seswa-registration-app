import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Participant from '@/models/Participant';

export async function DELETE() {
    try {
        await dbConnect();
        // Delete all participants
        await Participant.deleteMany({});

        return NextResponse.json({
            success: true,
            message: 'All participant data cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing data:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to clear data'
        }, { status: 500 });
    }
}
