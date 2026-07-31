<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use PDO;
use Exception;

class InstallWizardController extends Controller
{
    /**
     * Check system requirements
     */
    public function checkRequirements(): array
    {
        $phpVersion = PHP_VERSION;
        $phpSatisfied = version_compare($phpVersion, '8.2.0', '>=');

        $extensions = [
            'pdo_mysql' => extension_loaded('pdo_mysql'),
            'mbstring'  => extension_loaded('mbstring'),
            'openssl'   => extension_loaded('openssl'),
            'tokenizer' => extension_loaded('tokenizer'),
            'xml'       => extension_loaded('xml'),
            'curl'      => extension_loaded('curl'),
            'zip'       => extension_loaded('zip'),
            'gd'        => extension_loaded('gd'),
            'redis'     => extension_loaded('redis'),
            'bcmath'    => extension_loaded('bcmath'),
        ];

        $permissions = [
            'storage/app'           => is_writable(storage_path('app')),
            'storage/framework'     => is_writable(storage_path('framework')),
            'storage/logs'          => is_writable(storage_path('logs')),
            'bootstrap/cache'       => is_writable(base_path('bootstrap/cache')),
            '.env writable'         => is_writable(base_path('.env')) || is_writable(base_path()),
        ];

        $allOk = $phpSatisfied && !in_array(false, $extensions, true) && !in_array(false, $permissions, true);

        return [
            'php_version' => $phpVersion,
            'php_ok'      => $phpSatisfied,
            'extensions'  => $extensions,
            'permissions' => $permissions,
            'can_proceed' => $allOk,
        ];
    }

    /**
     * Test database connection
     */
    public function testDatabaseConnection(Request $request)
    {
        $request->validate([
            'db_host'     => 'required|string',
            'db_port'     => 'required|numeric',
            'db_database' => 'required|string',
            'db_username' => 'required|string',
            'db_password' => 'nullable|string',
        ]);

        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                $request->db_host,
                $request->db_port,
                $request->db_database
            );

            $pdo = new PDO($dsn, $request->db_username, $request->db_password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kết nối Cơ sở dữ liệu thành công!',
                'mysql_version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi kết nối CSDL: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Save .env file and run migrations & seeders
     */
    public function saveEnvironmentAndSetup(Request $request)
    {
        $request->validate([
            'app_name'      => 'required|string',
            'app_url'       => 'required|url',
            'db_host'       => 'required|string',
            'db_port'       => 'required|numeric',
            'db_database'   => 'required|string',
            'db_username'   => 'required|string',
            'db_password'   => 'nullable|string',
            'redis_host'    => 'required|string',
            'redis_port'    => 'required|numeric',
            'admin_name'    => 'required|string',
            'admin_email'   => 'required|email',
            'admin_password'=> 'required|string|min:8',
        ]);

        try {
            // Write to .env
            $envPath = base_path('.env');
            $envContent = File::exists(base_path('.env.example'))
                ? File::get(base_path('.env.example'))
                : '';

            $replacements = [
                'APP_NAME'      => '"' . $request->app_name . '"',
                'APP_URL'       => $request->app_url,
                'DB_HOST'       => $request->db_host,
                'DB_PORT'       => $request->db_port,
                'DB_DATABASE'   => $request->db_database,
                'DB_USERNAME'   => $request->db_username,
                'DB_PASSWORD'   => $request->db_password ?? '',
                'REDIS_HOST'    => $request->redis_host,
                'REDIS_PORT'    => $request->redis_port,
            ];

            foreach ($replacements as $key => $val) {
                if (preg_match("/^{$key}=.*/m", $envContent)) {
                    $envContent = preg_replace("/^{$key}=.*/m", "{$key}={$val}", $envContent);
                } else {
                    $envContent .= "\n{$key}={$val}";
                }
            }

            File::put($envPath, $envContent);

            // Generate APP_KEY
            Artisan::call('key:generate', ['--force' => true]);

            // Run migrations
            Artisan::call('migrate:fresh', ['--force' => true]);

            // Seed admin account & default system settings
            Artisan::call('db:seed', ['--force' => true]);

            // Create Installed Lock file
            File::put(storage_path('installed'), date('Y-m-d H:i:s'));

            return response()->json([
                'success' => true,
                'message' => 'Cài đặt hệ thống VNaStar Smart Shortener thành công!',
                'redirect' => '/login',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cài đặt thất bại: ' . $e->getMessage(),
            ], 500);
        }
    }
}
