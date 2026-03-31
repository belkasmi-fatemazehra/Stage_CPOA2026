<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\UserUpdatedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('nature')->orderBy('id', 'desc')->get();

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required',
            'service' => 'nullable',
            'nature_id' => 'nullable|exists:natures,id',
            'is_active' => 'required',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'service' => $request->service,
            'nature_id' => $request->nature_id,
            'is_active' => $request->is_active,
        ]);

        return response()->json([
            'message' => 'Utilisateur ajouté avec succès',
            'user' => $user,
        ]);
    }

    public function show($id)
    {
        $user = User::with('nature')->findOrFail($id);

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$id,
            'role' => 'required',
            'service' => 'nullable',
            'nature_id' => 'nullable|exists:natures,id',
            'is_active' => 'required',
            'password' => 'nullable|min:6',
        ]);

        // Stocker les anciennes valeurs
        $oldData = [
            'role' => $user->role,
            'service' => $user->service,
            'is_active' => $user->is_active,
            'nature_id' => $user->nature_id,
        ];

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'service' => $request->service,
            'nature_id' => $request->nature_id,
            'is_active' => $request->is_active,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // Envoyer un email à l'utilisateur modifié
        try {
            $newData = [
                'role' => $request->role,
                'service' => $request->service,
                'is_active' => $request->is_active,
                'nature_id' => $request->nature_id,
            ];

            $updatedBy = request()->user() ? request()->user()->name : 'Administrateur';

            Mail::to($user->email)->send(new UserUpdatedMail($user, $oldData, $newData, $updatedBy));
        } catch (\Exception $e) {
            // Ne pas bloquer la réponse si l'email échoue
            \Illuminate\Support\Facades\Log::error('Erreur envoi email: '.$e->getMessage());
        }

        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès',
        ]);
    }
}
