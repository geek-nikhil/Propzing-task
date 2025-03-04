import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // Get the access token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.split(' ')[1]; // Extract the token

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing access token' },
        { status: 401 }
      );
    }

    // Authenticate the user using the access token
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid access token' },
        { status: 401 }
      );
    }

    // Proceed with the task creation
    const { title, description, status } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }
     console.log(user.id)
    // Insert the task into the database
    const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, description, status, user_id: user.id }])
    .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get the access token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.split(' ')[1]; // Extract the token

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing access token' },
        { status: 401 }
      );
    }

    // Authenticate the user using the access token
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid access token' },
        { status: 401 }
      );
    }

    // Fetch tasks for the current user
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}