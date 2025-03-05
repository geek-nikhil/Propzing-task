import { supabase } from '../../../../../lib/supabase'; // Adjust the relative path
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// GET: Fetch a single task by ID
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT: Update a task by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // Extract `params` from the function arguments
) {
  const { id } = params;

  try {
    const { title, description, status } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
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
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
// DELETE: Delete a task by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
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