<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Page d'accueil
|--------------------------------------------------------------------------
*/
//affictation
Route::get('/affectations', function () {
    return Inertia::render('Affectations');
})->middleware('auth');

Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| Courrier Départ
|--------------------------------------------------------------------------
*/

// Liste
Route::get('/courrier-departs', function () {
    return Inertia::render('ListCourrierDeparts');
})->name('courrier-departs.index');

// Ajouter
Route::get('/courrier-departs/create', function () {
    return Inertia::render('CreateCourrierDepart');
})->name('courrier-departs.create');

// Export Excel
Route::get('/courrier-departs/export-excel', [\App\Http\Controllers\Api\CourrierDepartController::class, 'exportExcel']);

// Template Excel
Route::get('/courrier-departs/template-excel', [\App\Http\Controllers\Api\CourrierDepartController::class, 'downloadTemplate']);

/*
|--------------------------------------------------------------------------
| Courriers Arrivée
|--------------------------------------------------------------------------
*/

// Liste
Route::get('/courriers', function () {
    return Inertia::render('ListCourriers');
})->name('courriers.index');

// Ajouter + Modifier (نفس الصفحة)
Route::get('/courriers/create', function () {
    return Inertia::render('CreateCourrier');
})->name('courriers.create');

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return redirect('/');
})->middleware(['auth'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

// user :page gestion utilisateur
Route::get('/users', function () {
    return Inertia::render('Users');
});

// user API
Route::middleware(['auth'])->group(function () {

    Route::get('/users-api', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

});

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Affectations
|--------------------------------------------------------------------------
*/

Route::get('/affectations', function () {
    return Inertia::render('Affectations/Index');
})->name('affectations.index');

Route::get('/reponses', function () {
    return Inertia::render('Affectations/Responses');
})->name('reponses.index');
