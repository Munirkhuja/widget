<?php

namespace App\Http\Controllers;

use App\Models\LeadPipelineColumn;
use Illuminate\Http\Request;

class LeadPipelinneColumnController extends Controller
{
    public function index($account_id,$pipeline_id)
    {
        return LeadPipelineColumn::where('pipeline_id',$pipeline_id)->where('account_id',$account_id)->first();
    }
    public function set(Request $request)
    {

        LeadPipelineColumn::updateOrCreate(
            ['pipeline_id'=>$request->pipeline_id,'account_id'=>$request->account_id],
            ['columns_id'=>json_encode($request->columns_id)]
        );
        return true;
    }
}
