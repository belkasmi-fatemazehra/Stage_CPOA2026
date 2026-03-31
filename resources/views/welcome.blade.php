<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Bureau d'Ordre - Conseil Provincial Oujda-Angad</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:'Poppins',sans-serif;
background:#f0f4f8;
color:#333;
min-height:100vh;
}

/* SIDEBAR */

.sidebar{
width:260px;
background:linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%);
color:white;
min-height:100vh;
padding:0;
position:fixed;
height:100vh;
box-shadow:4px 0 20px rgba(0,0,0,0.15);
z-index:100;
}

.sidebar-header{
padding:25px 20px;
border-bottom:1px solid rgba(255,255,255,0.1);
background:rgba(0,0,0,0.2);
}

.sidebar-header .logo-area{
display:flex;
align-items:center;
gap:12px;
}

.sidebar-header .logo-icon{
width:45px;
height:45px;
background:white;
border-radius:10px;
display:flex;
align-items:center;
justify-content:center;
font-size:22px;
}

.sidebar-header h3{
margin:0;
font-size:16px;
font-weight:600;
}

.sidebar-header p{
margin:0;
font-size:11px;
opacity:0.7;
}

.sidebar-content{
padding:20px 15px;
}

.sidebar-label{
font-size:11px;
text-transform:uppercase;
letter-spacing:1px;
opacity:0.5;
margin-bottom:15px;
padding-left:10px;
}

.sidebar a{
display:flex;
align-items:center;
gap:12px;
padding:12px 15px;
border-radius:8px;
text-decoration:none;
color:white;
background:transparent;
margin-bottom:5px;
transition:all 0.2s ease;
font-size:14px;
font-weight:400;
}

.sidebar a:hover{
background:rgba(255,255,255,0.1);
}

.sidebar a.active{
background:rgba(59, 130, 246, 0.3);
font-weight:500;
}

.sidebar a .icon{
font-size:18px;
}

.sidebar-admin{
border-top:1px solid rgba(255,255,255,0.1);
padding:20px 15px;
}

.sidebar-user{
position:absolute;
bottom:0;
width:100%;
padding:20px;
border-top:1px solid rgba(255,255,255,0.1);
background:rgba(0,0,0,0.2);
}

.user-info{
display:flex;
align-items:center;
gap:10px;
}

.user-avatar{
width:35px;
height:35px;
background:#3b82f6;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
font-size:14px;
font-weight:bold;
}

.user-details p{
margin:0;
font-size:13px;
font-weight:500;
}

.user-details span{
margin:0;
font-size:11px;
opacity:0.6;
text-transform:capitalize;
}

/* MAIN CONTENT */

.main{
margin-left:260px;
flex:1;
}

/* HEADER */

.header{
background:linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
padding:25px 50px;
display:flex;
justify-content:space-between;
align-items:center;
box-shadow:0 4px 20px rgba(0,0,0,0.1);
}

.header-left{
display:flex;
align-items:center;
gap:15px;
}

.header-logo{
height:60px;
}

.header-title{
font-weight:600;
font-size:24px;
line-height:1.2;
}

.header-title small{
font-size:14px;
opacity:0.8;
display:block;
font-weight:400;
}

.header-right{
display:flex;
align-items:center;
gap:15px;
}

.user-welcome{
color:white;
font-size:14px;
}

.logout-btn{
background:rgba(255,255,255,0.2);
color:white;
padding:10px 20px;
border-radius:8px;
border:1px solid rgba(255,255,255,0.3);
cursor:pointer;
font-weight:500;
transition:all 0.2s;
}

.logout-btn:hover{
background:rgba(255,255,255,0.3);
}

.login-btn{
background:#22c55e;
color:white;
padding:12px 24px;
border-radius:8px;
border:none;
font-weight:600;
cursor:pointer;
text-decoration:none;
display:inline-block;
transition:all 0.2s;
}

.login-btn:hover{
background:#16a34a;
}

/* HERO SECTION */

.hero{
background:white;
padding:60px 50px;
text-align:center;
position:relative;
overflow:hidden;
}

.hero::before{
content:'';
position:absolute;
top:0;
left:0;
right:0;
height:5px;
background:linear-gradient(90deg, #1e3a5f, #2563eb, #22c55e);
}

.hero h1{
font-size:36px;
font-weight:700;
color:#1e3a5f;
margin-bottom:15px;
}

.hero p{
font-size:18px;
color:#64748b;
max-width:700px;
margin:auto;
line-height:1.6;
}

/* CARDS SECTION */

.cards-section{
padding:40px 50px;
}

.section-title{
text-align:center;
margin-bottom:40px;
}

.section-title h2{
font-size:28px;
font-weight:600;
color:#1e3a5f;
margin-bottom:10px;
}

.section-title p{
font-size:16px;
color:#64748b;
}

.cards-grid{
display:grid;
grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));
gap:25px;
max-width:1200px;
margin:auto;
}

.card{
background:white;
border-radius:16px;
overflow:hidden;
box-shadow:0 4px 20px rgba(0,0,0,0.08);
transition:all 0.3s ease;
border:1px solid #e2e8f0;
}

.card:hover{
transform:translateY(-8px);
box-shadow:0 20px 40px rgba(0,0,0,0.12);
}

.card-header{
padding:25px;
color:white;
}

.card-header.blue{
background:linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.card-header.green{
background:linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.card-header.purple{
background:linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
}

.card-header h3{
margin:0;
font-size:20px;
font-weight:600;
}

.card-header p{
margin:5px 0 0 0;
font-size:13px;
opacity:0.9;
}

.card-body{
padding:25px;
}

.card-body p{
color:#64748b;
font-size:14px;
line-height:1.6;
margin-bottom:20px;
}

.card-actions{
display:flex;
flex-direction:column;
gap:10px;
}

.card-btn{
padding:12px 20px;
border-radius:8px;
text-align:center;
text-decoration:none;
font-weight:500;
font-size:14px;
transition:all 0.2s;
}

.card-btn.primary{
background:#3b82f6;
color:white;
}

.card-btn.primary:hover{
background:#2563eb;
}

.card-btn.secondary{
background:#e2e8f0;
color:#475569;
}

.card-btn.secondary:hover{
background:#cbd5e1;
}

/* AFFECTATION CARD */

.affectation-section{
background:white;
padding:30px 50px;
margin:20px 50px;
border-radius:16px;
box-shadow:0 4px 20px rgba(0,0,0,0.08);
}

.affectation-header{
display:flex;
align-items:center;
gap:15px;
margin-bottom:20px;
}

.affectation-icon{
width:50px;
height:50px;
background:linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
border-radius:12px;
display:flex;
align-items:center;
justify-content:center;
font-size:24px;
}

.affectation-title h3{
margin:0;
font-size:20px;
color:#1e3a5f;
}

.affectation-title p{
margin:5px 0 0 0;
font-size:14px;
color:#64748b;
}

/* FOOTER */

.footer{
background:#0f172a;
color:white;
text-align:center;
padding:30px;
margin-top:40px;
}

.footer p{
margin:0;
font-size:14px;
opacity:0.8;
}

/* RESPONSIVE */

@media (max-width: 768px) {
.sidebar{
display:none;
}

.main{
margin-left:0;
}

.header{
padding:20px;
}

.hero{
padding:40px 20px;
}

.cards-section{
padding:20px;
}

.affectation-section{
margin:20px;
padding:20px;
}
}

</style>
</head>
<body>

<!-- SIDEBAR -->
<div class="sidebar">

<div class="sidebar-header">
<div class="logo-area">
<div class="logo-icon">🏛️</div>
<div>
<h3>Bureau d'Ordre</h3>
<p>Conseil Provincial</p>
</div>
</div>
</div>

<div class="sidebar-content">
<p class="sidebar-label">Menu Principal</p>

<a href="/">
<span class="icon">🏠</span>
<span>Accueil</span>
</a>

<a href="/courriers/create">
<span class="icon">📥</span>
<span>Courrier Arrivée</span>
</a>

<a href="/courrier-departs/create">
<span class="icon">📤</span>
<span>Courrier Départ</span>
</a>

<a href="/courriers">
<span class="icon">📋</span>
<span>Liste Arrivée</span>
</a>

<a href="/courrier-departs">
<span class="icon">📋</span>
<span>Liste Départ</span>
</a>
</div>

@auth
@if(in_array(auth()->user()->role, ['manager','admin']))
<div class="sidebar-admin">
<p class="sidebar-label">Administration</p>
<a href="/users" class="active">
<span class="icon">⚙️</span>
<span>Gestion Utilisateurs</span>
</a>
</div>
@endif
@if(auth()->user()->role == 'user')
<div class="sidebar-admin">
<p class="sidebar-label">Mon Service</p>
<a href="/affectations" class="active">
<span class="icon">📌</span>
<span>Mes Affectations</span>
</a>
</div>
@endif
@endauth

@auth
<div class="sidebar-user">
<div class="user-info">
<div class="user-avatar">
{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
</div>
<div class="user-details">
<p>{{ auth()->user()->name }}</p>
<span>{{ auth()->user()->role }}</span>
</div>
</div>
</div>
@endauth

</div>

<!-- MAIN CONTENT -->
<div class="main">

<!-- HEADER -->
<div class="header">
<div class="header-left">
<img src="{{ asset('images/wilaya.png') }}" class="header-logo">
<div class="header-title">
Bureau d'Ordre
<small>Conseil Provincial Oujda-Angad</small>
</div>
</div>

<div class="header-right">
@auth
<span class="user-welcome">Bienvenue, {{ auth()->user()->name }} 👋</span>
<form method="POST" action="{{ route('logout') }}">
@csrf
<button type="submit" class="logout-btn">
Déconnexion
</button>
</form>
@endauth

@guest
<a href="{{ route('login') }}" class="login-btn">
Se Connecter
</a>
@endguest
</div>
</div>

<!-- HERO -->
<div class="hero">
<h1>Bienvenue sur la Plateforme Bureau d'Ordre</h1>
<p>
Gérez efficacement les courriers entrants et sortants du Conseil Provincial d'Oujda-Angad.
Suivi, archivage sécurisé et accès rapide à tous vos documents administratifs.
</p>
</div>

<!-- CARDS -->
<div class="cards-section">
<div class="section-title">
<h2>Gestion des Courriers</h2>
<p>Accédez rapidement aux différentes fonctionnalités</p>
</div>

<div class="cards-grid">

<div class="card">
<div class="card-header blue">
<h3>📥 Courrier Arrivée</h3>
<p>Enregistrement des courriers entrants</p>
</div>
<div class="card-body">
<p>Enregistrer et suivre tous les courriers entrants dans le bureau d'ordre. Suivi complet et historique.</p>
<div class="card-actions">
<a href="/courriers/create" class="card-btn primary">Ajouter un Courrier</a>
<a href="/courriers" class="card-btn secondary">Voir la Liste</a>
</div>
</div>
</div>

<div class="card">
<div class="card-header green">
<h3>📤 Courrier Départ</h3>
<p>Création des courriers sortants</p>
</div>
<div class="card-body">
<p>Créer et envoyer des courriers administratifs vers des destinataires externes. Suivi des envois.</p>
<div class="card-actions">
<a href="/courrier-departs/create" class="card-btn primary">Créer un Courrier</a>
<a href="/courrier-departs" class="card-btn secondary">Voir la Liste</a>
</div>
</div>
</div>

<div class="card">
<div class="card-header purple">
<h3>👥 Administration</h3>
<p>Gestion des utilisateurs</p>
</div>
<div class="card-body">
<p>Gérer les utilisateurs du système. Attribuer les rôles et permissions.</p>
<div class="card-actions">
<a href="/users" class="card-btn primary">Gérer les Utilisateurs</a>
</div>
</div>
</div>

</div>
</div>

<!-- AFFECTATIONS -->
@auth
@if(auth()->user()->role == 'user')
<div class="affectation-section">
<div class="affectation-header">
<div class="affectation-icon">📌</div>
<div class="affectation-title">
<h3>Mes Affectations</h3>
<p>Consulter les courriers qui vous sont affectés</p>
</div>
</div>
<a href="/affectations" class="card-btn primary" style="display:inline-block; width:auto;">
Voir mes Affectations →
</a>
</div>
@endif
@endauth

<!-- FOOTER -->
<div class="footer">
<p>© 2026 Conseil de la Province d'Oujda-Angad - Bureau d'Ordre</p>
</div>

</div>

</body>
</html>