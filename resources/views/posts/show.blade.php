@extends('layouts.app')
    @section('content')

        <h1>{{ $post->title }}</h1>

        {!! $post->safe_html_content !!}

        <small>{{ $post->user->name }}</small>
        <h4>Comentarios</h4>

        {!! Form::open(['route' => ['posts.comments.store' , $post] , 'method' => 'POST']) !!}
            {!! Field::textarea('comment') !!}
            <button type="submit">Publicar Comentario</button>
        {!! Form::close() !!}

        @foreach($post->latestComments as $comment)
            <article class="{{ !$comment->answer ?: 'answer' }}">
                {{ $comment->comment }}
                @if(Gate::allows('accept' , $comment) &&  !$comment->answer)
                    {!! Form::open(['route' => ['comments.accepts' , $comment] , 'method' => 'POST']) !!}
                    <button type="submit">Aceptar respuesta</button>
                    {!! Form::close() !!}
                @endif
            </article>
        @endforeach

    @endsection