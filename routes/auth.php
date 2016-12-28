<?php


// Routes that require authentication.
// Posts
Route::resource('posts' , 'PostController' , [
    'only' => ['store' , 'create']
]);