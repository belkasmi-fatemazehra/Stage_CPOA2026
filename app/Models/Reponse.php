<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'affectation_id',
        'user_id',
    ];

    public function affectation()
    {
        return $this->belongsTo(Affectation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
