<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateUsersCommand extends Command
{
    protected $signature = 'create:users';

    protected $description = 'Create admin and service users';

    public function handle(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@bureau.dz',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $services = DB::table('services')->get();

        $serviceUsers = [
            ['name' => 'Agent Développement Social', 'email' => 'dev.social@bureau.dz'],
            ['name' => 'Agent Travaux', 'email' => 'travaux@bureau.dz'],
            ['name' => 'Agent Finances', 'email' => 'finances@bureau.dz'],
            ['name' => 'Agent RH', 'email' => 'rh@bureau.dz'],
            ['name' => 'Agent Bureau d\'Ordre', 'email' => 'bureau.ordre@bureau.dz'],
        ];

        foreach ($services->take(5) as $index => $service) {
            User::create([
                'name' => $serviceUsers[$index]['name'],
                'email' => $serviceUsers[$index]['email'],
                'password' => Hash::make('service123'),
                'role' => 'user',
                'service_id' => $service->id,
                'is_active' => true,
            ]);
        }

        $this->info('Users created successfully!');
    }
}
