<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modification du compte</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 20px 0;
        }
        .info-box h3 {
            margin-top: 0;
            color: #1e3a5f;
        }
        .changes-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .changes-table th, .changes-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .changes-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #374151;
        }
        .old-value {
            color: #dc2626;
            text-decoration: line-through;
        }
        .new-value {
            color: #059669;
            font-weight: 600;
        }
        .footer {
            background-color: #1e3a5f;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Bureau d'Ordre</h1>
            <p>Conseil Provincial Oujda-Angad</p>
        </div>
        
        <div class="content">
            <h2>Bonjour {{ $user->name }},</h2>
            
            <p>Votre compte a été modifié par <strong>{{ $updatedBy }}</strong>.</p>
            
            <div class="info-box">
                <h3>📋 Détails des modifications :</h3>
                
                <table class="changes-table">
                    <thead>
                        <tr>
                            <th>Champ</th>
                            <th>Avant</th>
                            <th>Après</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if(isset($oldData['role']) && $oldData['role'] !== $newData['role'])
                        <tr>
                            <td><strong>Role</strong></td>
                            <td class="old-value">{{ $oldData['role'] }}</td>
                            <td class="new-value">{{ $newData['role'] }}</td>
                        </tr>
                        @endif
                        
                        @if(isset($oldData['service']) && $oldData['service'] !== $newData['service'])
                        <tr>
                            <td><strong>Service</strong></td>
                            <td class="old-value">{{ $oldData['service'] ?? 'Non assigné' }}</td>
                            <td class="new-value">{{ $newData['service'] ?? 'Non assigné' }}</td>
                        </tr>
                        @endif
                        
                        @if(isset($oldData['is_active']) && $oldData['is_active'] !== $newData['is_active'])
                        <tr>
                            <td><strong>Statut</strong></td>
                            <td class="old-value">{{ $oldData['is_active'] ? 'Actif' : 'Désactivé' }}</td>
                            <td class="new-value">{{ $newData['is_active'] ? 'Actif' : 'Désactivé' }}</td>
                        </tr>
                        @endif
                        
                        @if(isset($oldData['nature_id']) && $oldData['nature_id'] !== $newData['nature_id'])
                        <tr>
                            <td><strong>Nature</strong></td>
                            <td class="old-value">{{ $oldData['nature_id'] ?? 'Non assigné' }}</td>
                            <td class="new-value">{{ $newData['nature_id'] ?? 'Non assigné' }}</td>
                        </tr>
                        @endif
                    </tbody>
                </table>
            </div>
            
            <p>Si vous n'avez pas effectué ces modifications, veuillez contacter l'administrateur.</p>
            
            <p>Cordialement,<br>L'équipe Bureau d'Ordre</p>
        </div>
        
        <div class="footer">
            <p>© 2026 Conseil de la Province d'Oujda-Angad</p>
            <p>Bureau d'Ordre - Gestion des Courriers</p>
        </div>
    </div>
</body>
</html>