<?php


// Routes that require authentication.
// Posts
Route::resource('posts' , 'PostController' , [
    'only' => ['store' , 'create']
]);

Route::resource('posts.comments' , 'CommentsController' , [
   'only' => ['store']
]);

Route::post('comments/{comment}/accept' , [
   'uses'   => 'CommentsController@accept',
    'as'    => 'comments.accepts'
]);