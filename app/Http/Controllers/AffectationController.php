<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    // 📌 liste
    public function index()
    {
        return Affectation::with(['courrier', 'service'])->get();

    }

    // 📌 ajouter affectation
    public function store(Request $request)
    {
        $request->validate([
            'courrier_id' => 'required|exists:courriers,id',
            'services' => 'required|array',
            'services.*' => 'exists:services,id',
            'message' => 'nullable',
        ]);

        foreach ($request->services as $service_id) {

            Affectation::create([
                'date_affectation' => now(),
                'message' => $request->message ?? 'faire le nécessaire',
                'courrier_id' => $request->courrier_id,
                'service_id' => $service_id,
            ]);
        }

        return response()->json([
            'message' => 'Affectation envoyée avec succès',
        ]);
    }

    // 📌 show
    public function show($id)
    {
        return Affectation::with(['courrier', 'service'])->findOrFail($id);
    }

    // 📌 delete
    public function destroy($id)
    {
        $affectation = Affectation::findOrFail($id);
        $affectation->delete();

        return response()->json([
            'message' => 'Affectation supprimée',
        ]);
    }

    public function myAffectations(Request $request)
    {
        $serviceName = $request->input('service_name');

        // Debug: return all if no service_name
        if (! $serviceName) {
            return Affectation::with(['courrier', 'service'])->get();
        }

        return Affectation::with(['courrier', 'service'])
            ->whereHas('service', function ($query) use ($serviceName) {
                $query->where('nom_service', 'like', '%'.$serviceName.'%');
            })
            ->get();
    }
}