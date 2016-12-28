<?php


class ShowPostTest extends FeatureTestCase
{
    function test_a_user_can_see_the_post_details()
    {
        // Having

        $title   = "Este es el titulo del post";
        $content = "Este es el contenido del post";
        $name    = "Johan Villamil";

        $user = $this->defaultUser([
            'name' => $name
        ]);

        $post = $this->createPost([
            'title'     => $title,
            'content'   => $content,
            'user_id'   => $user->id
        ]);

        
        // When
        $this->visit($post->url)
            ->seeInElement('h1', $post->title)
            ->see($post->content)
            ->see($user->name);
    }

    function test_old_urls_are_redirected()
    {
        // Having

        $post = $this->createPost([
            'title' => 'Old title',
        ]);

        $url = $post->url;

        $post->update(['title' => 'New title']);

        $this->visit($url)
            ->seePageIs($post->url);
    }
}
