<?php

use Illuminate\Foundation\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic functional test example.
     *
     * @return void
     */
    public function testBasicExample()
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
