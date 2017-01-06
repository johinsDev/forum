<?php

use \Illuminate\Foundation\Testing\DatabaseTransactions;

class FeatureTestCase extends TestCase
{
    use DatabaseTransactions;

    public function defaultUser(array $attributes = [])
    {
        if ($this->defaultUser){
            return $this->defaultUser;
        }

        return $this->defaultUser = $user = factory(\App\User::class)->create($attributes);
    }

    public function seeErrors($fields)
    {
        foreach ($fields as $name => $error){
            foreach ((array) $error as $mesage){
                $this->seeInElement(
                    "#field_{$name}.has-error .help-block",
                    $mesage
                );
            }
        }
    }
}