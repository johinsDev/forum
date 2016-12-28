<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function create()
    {
        return view('posts.create');
    }

    public function store(Request $request)
    {
        $this->validate($request , [
            'title'     => 'required',
            'content'   => 'required'
        ]);

        $post = new Post($request->all());
        auth()->user()->posts()->save($post);

        return $post->title;
    }

    public function show(Post $post , $slug)
    {
        if ($post->slug != $slug) {
            return redirect($post->url, 301);
        }

        return view('posts.show' , compact('post'));
    }
}
