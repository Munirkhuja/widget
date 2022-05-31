<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadPipelineColumn extends Model
{
    use HasFactory;
    protected $fillable = [
        'account_id',
        'pipeline_id',
        'columns_id',
    ];
    protected $guarded = [];

    protected $casts = [
        'columns_id' => 'array'
    ];

    public function setPropertiesAttribute($value)
    {
        $columns_id = [];

        foreach ($value as $array_item) {
            if (!is_null($array_item['key'])) {
                $columns_id[] = $array_item;
            }
        }

        $this->attributes['columns_id'] = json_encode($columns_id);
    }
}
