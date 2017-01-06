<?php

namespace App\Http\Controllers;

use App\Post;
use App\Comment;
use Illuminate\Http\Request;

class CommentsController extends Controller
{
    public function store(Request $request , Post $post)
    {
        auth()->user()->comment($post , $request->get('comment'));
        return redirect($post->url);
    }

    public function accept(Comment $comment)
    {
        $this->authorize('accept' , $comment);
        $comment->markAsAnswer();
        return redirect($comment->post->url);
    }
    
}
