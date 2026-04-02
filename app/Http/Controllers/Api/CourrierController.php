<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use App\Models\Courrier;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use setasign\Fpdi\Fpdi;

class CourrierController extends Controller
{
    // 🔹 الرقم التالي حسب السنة
    public function nextNumber(Request $request)
    {

        $annee = $request->annee ?? date('Y');

        $last = Courrier::where('annee', $annee)
            ->orderByRaw('CAST(numero as UNSIGNED) desc')
            ->first();

        if (! $last) {

            $numero = '001';

        } else {

            $number = intval($last->numero) + 1;

            $numero = str_pad($number, 3, '0', STR_PAD_LEFT);

        }

        return response()->json([
            'numero' => $numero,
        ]);

    }

    // 🔹 تسجيل courrier جديد
    public function store(Request $request)
    {
        try {
            Log::info('Store courrier - Request start');

            $validated = $request->validate([
                'numero' => 'required|string|max:50',
                'annee' => 'required|integer|min:2000|max:2100',
                'type' => 'required|string|max:100',
                'objet' => 'required|string|max:500',
                'date_courrier' => 'required|date',
                'nature_id' => 'required|integer|exists:natures,id',
                'description' => 'nullable|string|max:1000',
                'expediteur' => 'nullable|string|max:255',
                'nombre_pieces' => 'nullable|integer|min:1',
                'observations' => 'nullable|string|max:1000',
                'fichier' => 'nullable|file|mimes:pdf|max:10240',
            ]);

            Log::info('Validation passed', $validated);

            $user = Auth::user();
            Log::info('User authenticated:', ['id' => $user ? $user->id : null, 'name' => $user ? $user->name : null]);

            $courrier = Courrier::create([
                'numero' => $validated['numero'],
                'annee' => $validated['annee'],
                'type' => $validated['type'],
                'objet' => $validated['objet'],
                'description' => $validated['description'] ?? null,
                'date_courrier' => $validated['date_courrier'],
                'date_arrivee' => $validated['date_courrier'],
                'expediteur' => $validated['expediteur'] ?? null,
                'nombre_pieces' => $validated['nombre_pieces'] ?? null,
                'observations' => $validated['observations'] ?? null,
                'nature_id' => $validated['nature_id'],
                'user_id' => $user ? $user->id : 1,
                'status_id' => 1,
            ]);

            Log::info('Courrier created:', ['id' => $courrier->id, 'numero' => $courrier->numero]);

            if ($request->hasFile('fichier')) {
                try {
                    $file = $request->file('fichier');

                    $folder = 'courriers/arrives';

                    $filename = 'courrier_arrive_'.$courrier->annee.'_'.$courrier->numero.'_'.Str::uuid().'.pdf';

                    $path = $file->storeAs($folder, $filename, 'public');

                    $courrier->fichier = $path;
                    $courrier->save();

                    Log::info('File uploaded:', ['path' => $path]);
                } catch (\Exception $fileException) {
                    Log::error('File upload failed:', ['error' => $fileException->getMessage()]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Courrier ajouté avec succès',
                'courrier' => $courrier,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed:', $e->errors());

            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Store courrier error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du courrier',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // 🔹 liste courriers arrivée
    public function index()
    {

        $courriers = Courrier::with([
            'affectations.service',
            'nature',
            'status',
        ])
            ->orderBy('annee', 'desc')
            ->orderByRaw('CAST(numero as UNSIGNED) desc')
            ->get();

        return response()->json($courriers);

    }

    // 🔹 Voir courrier (validation automatique)
    public function valider($id)
    {

        $courrier = Courrier::findOrFail($id);

        $courrier->status_id = 2;

        $courrier->save();

        return response()->json([
            'message' => 'courrier validé',
        ]);

    }

    // 🔹 supprimer courrier
    public function destroy($id)
    {

        $courrier = Courrier::findOrFail($id);

        $courrier->delete();

        return response()->json([
            'message' => 'courrier supprimé',
        ]);

    }

    // 🔹 تحميل PDF
    public function downloadPdf($id)
    {
        $courrier = Courrier::with([
            'affectations.service',
            'nature',
        ])->findOrFail($id);

        $tempDir = storage_path('app/temp');

        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        // formulaire
        $formulaire = Pdf::loadView('pdf.courrier', [
            'courrier' => $courrier,
        ]);

        $formulairePath = $tempDir.'/temp_formulaire_'.$courrier->id.'.pdf';
        file_put_contents($formulairePath, $formulaire->output());

        // pdf final
        $pdf = new Fpdi;

        $pageCount = $pdf->setSourceFile($formulairePath);

        for ($i = 1; $i <= $pageCount; $i++) {
            $template = $pdf->importPage($i);
            $size = $pdf->getTemplateSize($template);

            $orientation = ($size['width'] > $size['height']) ? 'L' : 'P';

            $pdf->AddPage($orientation, [$size['width'], $size['height']]);
            $pdf->useTemplate($template);
        }

        // scan pdf
        if (! empty($courrier->fichier)) {
            $scanPath = storage_path('app/public/'.$courrier->fichier);

            if (file_exists($scanPath) && strtolower(pathinfo($scanPath, PATHINFO_EXTENSION)) === 'pdf') {
                $scanPageCount = $pdf->setSourceFile($scanPath);

                for ($i = 1; $i <= $scanPageCount; $i++) {
                    $template = $pdf->importPage($i);
                    $size = $pdf->getTemplateSize($template);

                    $orientation = ($size['width'] > $size['height']) ? 'L' : 'P';

                    $pdf->AddPage($orientation, [$size['width'], $size['height']]);
                    $pdf->useTemplate($template);
                }
            }
        }

        $finalPath = $tempDir.'/courrier_'.$courrier->id.'_final.pdf';

        $pdf->Output($finalPath, 'F');

        return response()->download(
            $finalPath,
            'courrier-'.$courrier->numero.'.pdf',
            ['Content-Type' => 'application/pdf']
        )->deleteFileAfterSend(true);
    }

    // 🔹 afficher courrier واحد (باش يتعمر formulaire modifier)
    public function show($id)
    {

        $courrier = Courrier::with([
            'affectations.service',
            'nature',
        ])->findOrFail($id);

        return response()->json($courrier);

    }

    // 🔹 modifier courrier
    public function update(Request $request, $id)
    {

        $courrier = Courrier::findOrFail($id);

        $courrier->update([

            'type' => $request->type,
            'objet' => $request->objet,
            'description' => $request->description,
            'date_courrier' => $request->date_courrier,
            'date_arrivee' => $request->date_courrier,
            'expediteur' => $request->expediteur,

            'nombre_pieces' => $request->nombre_pieces,
            'observations' => $request->observations,
            'nature_id' => $request->nature_id,

        ]);

        // update service
        $affectation = Affectation::where('courrier_id', $courrier->id)->first();

        if ($affectation) {

            $affectation->update([
                'service_id' => $request->service_id,
            ]);

        }

        return response()->json([
            'message' => 'courrier modifié',
        ]);

    }

    public function genererPdf($annee)
    {

        $courriers = Courrier::with([
            'affectations.service',
            'nature',
        ])
            ->where('annee', $annee)
            ->orderByRaw('CAST(numero as UNSIGNED) asc')
            ->get();

        $pdf = Pdf::loadView('pdf.liste_courriers', [
            'courriers' => $courriers,
            'annee' => $annee,
        ]);

        return $pdf->download('liste-courriers-'.$annee.'.pdf');

    }
}
