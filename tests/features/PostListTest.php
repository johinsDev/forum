<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PostListTest extends FeatureTestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    function test_user_can_see_the_post_list_and_go_to_details()
    {
        $post = $this->createPost([
            'title' => 'Debo usar Laravel 5.3 o 5.1 LTS?'
        ]);

        $this->visit('/')
            ->seeInElement('h1', 'Posts')
            ->see($post->title)
            ->click($post->title)
            ->seePageIs($post->url);
    }

    function test_the_posts_are_paginated()
    {
        //Having
        $first = factory(\App\Post::class)->create([
            'title' => 'Post mas antiguo',
        ]);

        factory(\App\Post::class)->times(15)->create();

        $last = factory(\App\Post::class)->create([
           'title' => 'Post mas reciente'
        ]);

        $this->visit('/')
            ->see($last->title)
            ->dontSee($first->title)
            ->click('2')
            ->see($first->title)
            ->dontSee($last->title);
       
    }
}
