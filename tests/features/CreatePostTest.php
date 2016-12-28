<?php


class CreatePostTest extends FeatureTestCase
{
    function test_a_user_create_post()
    {
        //Having
        $title = 'Esta es una pregunta';
        $content = 'Esta es el contenido';

        $this->actingAs($user = $this->defaultUser());

        //When

        $this->visit(route('posts.create'))
                ->type( $title, 'title')
                ->type( $content , 'content')
                ->press('Publicar');

        //Then
        $this->seeInDatabase('posts' , [
            'title'     => $title,
            'content'   => $content,
            'pending'   => true,
            'user_id'   => $user->id
        ]);

        //Test a user is redirect to the posts details after creating it.
        $this->see($title);
    }

    function test_creating_a_post_require_authentication()
    {
        //When

        $this->visit(route('posts.create'));

        //Then
        $this->seePageIs(route('login'));
    }

    function test_create_post_form_validation()
    {
        $this->actingAs($this->defaultUser())
            ->visit(route('posts.create'))
            ->press('Publicar')
            ->seePageIs(route('posts.create'))
            ->seeErrors([
                'title'     => 'El campo título es obligatorio',
                'content'   => 'El campo contenido es obligatorio'
            ]);
    }
}