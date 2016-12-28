<?php


class ExampleTest extends FeatureTestCase
{

    /**
     * A basic functional test example.
     *
     * @return void
     */
    function test_basic_example()
    {
        $user = factory(\App\User::class)->create([
            'name'   => 'Johan Villamil' ,
            'email'  => 'johinsdev@gmail.com'
        ]);

        $this->actingAs($user ,'api')
            ->visit('api/user')
            ->see('Johan Villamil johinsdev@gmail.com');
    }
}
