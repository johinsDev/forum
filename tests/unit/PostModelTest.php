<?php

class PostModelTest extends TestCase
{

    function test_adding_a_title_generates_a_slug()
    {
        $post = new \App\Post([
            'title' => 'Como instalar laravel'
        ]);

        $this->assertSame('como-instalar-laravel' , $post->slug);
    }

    function test_edit_a_title_changes_a_slug()
    {
        $post = new \App\Post([
            'title' => 'Como instalar laravel'
        ]);

        $post->title = 'Como instalar laravel 5.1 LTS';

        $this->assertSame('como-instalar-laravel-51-lts' , $post->slug);
    }

    function test_adding_a_post_is_equal_to_get_url()
    {
        $post = new \App\Post([
            'title' => 'Como instalar laravel'
        ]);

        $this->assertSame(route('posts.show', [ $post->id , 'como-instalar-laravel']), $post->url);
    }
}
