import { supabase } from '../../../../../lib/supabase'; // Adjust the relative path
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, description, status } = await request.json();

  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ title, description, status })
    .eq('id', id)
    .select();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await the params object
    const { id } = await params;

    // Extract the access token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing access token' },
        { status: 401 }
      );
    }

    // Get the authenticated user's ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid access token' },
        { status: 401 }
      );
    }

    // Delete the task
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure the task belongs to the authenticated user

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 }); // No content response
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}