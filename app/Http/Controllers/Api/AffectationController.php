<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use App\Models\Reponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AffectationController extends Controller
{
    // 📌 liste des affectations
    public function index()
    {
        try {
            $user = Auth::user();

            Log::info('Affectation index - User:', [
                'id' => $user ? $user->id : null,
                'name' => $user ? $user->name : null,
                'role' => $user ? $user->role : null,
                'service_id' => $user ? $user->service_id : null,
            ]);

            if (! $user) {
                return response()->json(['error' => 'Non connecté'], 401);
            }

            $query = Affectation::with([
                'courrier',
                'service',
                'reponses',
            ])->orderBy('date_affectation', 'desc')->orderBy('created_at', 'desc');

            // Si l'utilisateur n'est pas admin, filtrer par son service
            if ($user->role !== 'admin') {
                if (! $user->service_id) {
                    Log::warning('Affectation index - No service_id for user:', ['user_id' => $user->id]);

                    return response()->json(['error' => 'Aucun service associé'], 400);
                }
                Log::info('Filtering by service_id:', ['service_id' => $user->service_id]);
                $query->where('service_id', $user->service_id);
            }

            $affectations = $query->get();

            Log::info('Affectations found:', ['count' => $affectations->count()]);

            return response()->json($affectations);
        } catch (\Exception $e) {
            Log::error('Erreur index affectations: '.$e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // 📌 créer affectation
    public function store(Request $request)
    {
        try {
            // Validation des données
            $validated = $request->validate([
                'courrier_id' => 'required|integer|exists:courriers,id',
                'services' => 'required|array|min:1|max:2',
                'services.*' => 'required|integer|exists:services,id',
                'message' => 'nullable|string|max:1000',
            ]);

            $createdAffectations = [];

            foreach ($validated['services'] as $serviceId) {
                $affectation = Affectation::create([
                    'date_affectation' => now(),
                    'message' => $validated['message'] ?? 'faire le nécessaire',
                    'courrier_id' => $validated['courrier_id'],
                    'service_id' => $serviceId,
                ]);

                $createdAffectations[] = $affectation->id;
            }

            Log::info('Affectation créée avec succès', [
                'courrier_id' => $validated['courrier_id'],
                'services' => $validated['services'],
                'affectation_ids' => $createdAffectations,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Affectation envoyée avec succès',
                'affectations' => $createdAffectations,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation erreur affectation: ', $e->errors());

            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Erreur création affectation: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'affectation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // 📌 voir une affectation
    public function show($id)
    {
        try {
            $affectation = Affectation::with([
                'courrier',
                'service',
                'reponses',
            ])->findOrFail($id);

            return response()->json($affectation);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Affectation non trouvée'], 404);
        }
    }

    // 📌 supprimer une affectation
    public function destroy($id)
    {
        try {
            $affectation = Affectation::findOrFail($id);
            $affectation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Affectation supprimée',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
            ], 500);
        }
    }

    // 📌 répondre à une affectation
    public function respond(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|min:1|max:5000',
            ]);

            $affectation = Affectation::findOrFail($id);

            // Récupérer l'utilisateur connecté (si disponible)
            $user = Auth::user();

            $reponse = Reponse::create([
                'message' => $validated['message'],
                'affectation_id' => $affectation->id,
                'user_id' => $user ? $user->id : 1,
            ]);

            Log::info('Réponse créée', [
                'affectation_id' => $id,
                'reponse_id' => $reponse->id,
                'user_id' => $user ? $user->id : 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Réponse envoyée avec succès',
                'reponse' => $reponse,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Erreur réponse affectation: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de la réponse',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // 📌 liste des réponses (pour l'admin)
    public function responses()
    {
        try {
            $reponses = Reponse::with([
                'affectation.courrier',
                'affectation.service',
                'user',
            ])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($reponses);
        } catch (\Exception $e) {
            Log::error('Erreur liste réponses: '.$e->getMessage());

            return response()->json([
                'error' => 'Erreur lors de la récupération des réponses',
            ], 500);
        }
    }
}
