<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public $oldData;

    public $newData;

    public $updatedBy;

    public function __construct(User $user, $oldData, $newData, $updatedBy)
    {
        $this->user = $user;
        $this->oldData = $oldData;
        $this->newData = $newData;
        $this->updatedBy = $updatedBy;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Modification de votre compte - Bureau d\'Ordre',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.user-updated',
        );
    }
}
