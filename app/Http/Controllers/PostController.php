<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::orderBy('id' , 'DESC')->paginate();
        return view('posts.index' ,compact('posts'));
    }
    
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

       $post =  auth()->user()->post($request);

        return redirect($post->url);
    }

    public function show(Post $post , $slug)
    {
        if ($post->slug != $slug) {
            return redirect($post->url, 301);
        }

        return view('posts.show' , compact('post'));
    }
}
