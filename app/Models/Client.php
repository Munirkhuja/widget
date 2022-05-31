<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed account_id
 * @property mixed subdomain
 * @property mixed client_uuid
 * @property mixed token
 */
class Client extends Model
{
    use HasFactory;

    private static $current;

    protected $fillable = [
        'subdomain', 'account_id', 'token'
    ];

    public static function current(): ?Client
    {
        return self::$current;
    }

    public static function setCurrent($token): ?Client
    {
        if (!self::$current) {
            self::$current = Client::where('token', $token)->first();
        }

        return self::$current;
    }

    public static function add($subdomain): Client
    {
        $client = Client::where('subdomain', $subdomain)->first();

        if (!$client) {
            $client = Client::create([
                'subdomain' => $subdomain,
                'token' => self::tokenGenerate()
            ]);
        }

        return $client;
    }

    private static function tokenGenerate(): string
    {
        $bytes = openssl_random_pseudo_bytes(20, $cstrong);
        return bin2hex($bytes);
    }

    public static function currentBySubdomain($subdomain): ?Client
    {
        if (!self::$current) {
            self::$current = Client::where('subdomain', $subdomain)->first();
        }

        return self::$current;
    }

    public static function setCurrentBySubdomain($subdomain)
    {
        self::$current = Client::where('subdomain', $subdomain)->first();
    }
}
