<?php

namespace App\Console\Commands;

use App\Models\Service;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RemoveDuplicateServices extends Command
{
    protected $signature = 'services:remove-duplicates';

    protected $description = 'Supprime les services en double en gardant le plus ancien';

    public function handle(): int
    {
        $this->info('Recherche des services en double...');

        $duplicates = Service::select('nom_service', DB::raw('COUNT(*) as count'))
            ->groupBy('nom_service')
            ->having('count', '>', 1)
            ->get();

        if ($duplicates->isEmpty()) {
            $this->info('Aucun doublon trouvé.');

            return Command::SUCCESS;
        }

        $this->warn('Trouvés '.$duplicates->count().' services avec des doublons.');

        foreach ($duplicates as $duplicate) {
            $services = Service::where('nom_service', $duplicate->nom_service)
                ->orderBy('id', 'asc')
                ->get();

            $keep = $services->first();
            $toDelete = $services->skip(1);

            $this->line('Traitement: "'.$duplicate->nom_service.'"');
            $this->line('  - ID à garder: '.$keep->id);
            $this->line('  - IDs à supprimer: '.$toDelete->pluck('id')->join(', '));

            foreach ($toDelete as $service) {
                $affectationsCount = $service->affectations()->count();
                if ($affectationsCount > 0) {
                    $this->warn('    -> Transfert '.$affectationsCount.' affectations vers ID '.$keep->id);
                    DB::table('affectations')
                        ->where('service_id', $service->id)
                        ->update(['service_id' => $keep->id]);
                }

                $service->delete();
                $this->line('    -> Supprimé ID: '.$service->id);
            }
        }

        $this->info('Doublons supprimés avec succès!');

        return Command::SUCCESS;
    }
}
