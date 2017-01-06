<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class WriteCommentTest extends FeatureTestCase
{
    function test_a_user_can_a_write_comment()
    {
        //Having
        $post = $this->createPost();
        $user = $this->defaultUser();
        //When
        $this->actingAs($user)
            ->visit($post->url)
            ->type('Un comentario' , 'comment')
            ->press('Publicar Comentario');

        //Then
        $this->seeInDatabase('comments' , [
            'comment'   => 'Un comentario',
            'user_id'   => $user->id,
            'post_id'   => $post->id
        ]);

        $this->seePageIs($post->url);
    }
}
