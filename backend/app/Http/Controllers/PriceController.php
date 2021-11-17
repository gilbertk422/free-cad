<?php
/**
 * Created by PhpStorm.
 * User: dev
 * Date: 27.05.19
 * Time: 10:36
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PriceController extends BaseController
{
    public function get(Request $requestInput){

        $client = new \GuzzleHttp\Client();


        $content = iconv("UTF-8", "ASCII", file_get_contents($requestInput->file("design")->getRealPath()));

        $content = str_replace("RAL".chr(32)."Color","RAL".chr(160)."Color",$content);

        $name = $requestInput->file("design")->getClientOriginalName().date('d-m-Y H:i:s');

        Storage::disk('uploads')->put($name, $content);

        $requestData = [
            [
                'name'     => 'password',
                'contents' => "meazhysz"
            ],
            [
                'name'     => 'inputParameters',
                'contents' => $requestInput->get("inputParameters")
            ],
            [
                'name'     => 'design',
                'contents' => Storage::disk('uploads')->get($name),
                'filename' => $requestInput->file("design")->getClientOriginalName()
            ]
        ];
        $request = $client->post("https://www.emachineshop.com/task/price/emsx/", array(
                'multipart' => $requestData
            )
        );

        Log::info('request design file path:'.$name."\n".json_encode($requestInput->get("inputParameters")));
        try {
            $response = $request->getBody()->getContents();
            Log::info('response to the file '.$name."\n" .$response);
        }catch (\Exception $e){
            Log::error('Error with whit design file '.$name."\n".$e);
            return '{"error":"An error of the \"price server\", try later, please.", "detail":"'+$e+'"}';
        }
        return $response;
    }
}
