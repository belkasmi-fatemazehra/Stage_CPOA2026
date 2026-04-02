<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // afficher tous les services
    public function index()
    {
        return response()->json(Service::all());
    }

    // ajouter nouveau service
    public function store(Request $request)
    {

        $request->validate([
            'nom_service' => 'required|string|max:255|unique:services,nom_service',
        ], [
            'nom_service.unique' => 'Un service avec ce nom existe déjà.',
        ]);

        $service = Service::create([
            'nom_service' => $request->nom_service,
        ]);

        return response()->json([
            'message' => 'Service ajouté',
            'service' => $service,
        ]);
    }
}
